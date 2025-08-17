export const runtime = 'edge';

import { z } from 'zod';

const BodySchema = z.object({
  prompt: z.string().trim().min(1, 'prompt required').max(4000),
});

// Simple health check: GET /api/assistant
export async function GET() {
  const ok = Boolean(process.env.OPENAI_API_KEY);
  return Response.json({ ok, hasKey: ok }, { status: ok ? 200 : 500 });
}

// Convert OpenAI SSE (chat/completions) into a plain text stream
function sseToTextStream(resp: Response): ReadableStream<Uint8Array> {
  const te = new TextEncoder();
  const td = new TextDecoder();
  const reader = resp.body!.getReader();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = '';
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += td.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const raw of lines) {
            const line = raw.trim();
            if (!line.startsWith('data:')) continue;

            const data = line.slice(5).trim();
            if (data === '[DONE]') {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              const delta: string =
                json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.text ?? '';
              if (delta) controller.enqueue(te.encode(delta));
            } catch {
              // ignore keepalives/partial
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'Server not configured: missing OPENAI_API_KEY' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { prompt } = parsed.data;

  // Headers + optional org routing
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${apiKey}`,
  };
  if (process.env.OPENAI_ORG_ID) {
    headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID;
  }

  // Use Chat Completions with streaming (supported for gpt-4o / gpt-4o-mini)  .
  // (Responses API is also available; this keeps your existing client logic.)
  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'You are a concise assistant inside an analytics dashboard. Be direct and helpful.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => '');
    // Visible in Vercel/terminal logs so we can see the real reason
    console.error('OpenAI upstream error', upstream.status, text.slice(0, 500));
    return Response.json(
      {
        error: 'Upstream error',
        status: upstream.status,
        details: text.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const stream = sseToTextStream(upstream);
  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
    },
  });
}

export const runtime = 'edge';

import { z } from 'zod';

const BodySchema = z.object({
  prompt: z.string().trim().min(1, 'prompt required').max(4000),
});

/** Convert OpenAI Chat Completions SSE to a plain text stream */
function sseToTextStream(resp: Response): ReadableStream<Uint8Array> {
  const te = new TextEncoder();
  const td = new TextDecoder();

  const reader = resp.body!.getReader();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = '';

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
            // ignore keepalives/partial lines
          }
        }
      }

      controller.close();
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

  // Call OpenAI (Chat Completions, streamed)
  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // fast & affordable; change if you prefer
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
    const text = await upstream.text().catch(() => 'Unknown error');
    return Response.json({ error: 'Upstream error', details: text.slice(0, 500) }, { status: 502 });
  }

  const stream = sseToTextStream(upstream);
  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
    },
  });
}

// src/app/api/assistant/route.ts
export const runtime = 'edge';

import { z } from 'zod';

const BodySchema = z.object({
  prompt: z.string().trim().min(1, 'prompt required').max(4000),
});

export async function GET() {
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  const mock = isMockEnabled() || !hasKey;
  return Response.json({ ok: true, hasKey, mock }, { status: 200 });
}

function isMockEnabled() {
  const v = (process.env.MOCK_AI ?? '').toLowerCase().trim();
  return v === '1' || v === 'true' || v === 'yes';
}

/** Stream a string in little chunks (to mimic token streaming) */
function streamText(text: string, chunkSize = 24, delayMs = 25) {
  const te = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 0; i < text.length; i += chunkSize) {
        const slice = text.slice(i, i + chunkSize);
        controller.enqueue(te.encode(slice));
        if (delayMs > 0) {
          // simulate latency
          await new Promise((r) => setTimeout(r, delayMs));
        }
      }
      controller.close();
    },
  });
}

/** Very small heuristic to make mock replies feel helpful */
function generateMockAnswer(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('kpi')) {
    return [
      'Here are 3 KPI ideas tailored to a SaaS trial → paid funnel:',
      '• Trial → Signup conversion rate (weekly trend, segmented by source)',
      '• Trial activation (first value moment within 24h)',
      '• Trial → Paid conversion & median time-to-convert',
      '',
      'Tip: Add a KPI widget for each and color-code thresholds.',
    ].join('\n');
  }

  if (p.includes('traffic') || p.includes('chart')) {
    return [
      'Traffic looks stable week-over-week.',
      '• Small weekday lift (~+4%) and weekend dip (~-8%)',
      '• Consider annotating release dates on the line chart',
      '• Next step: slice by channel to confirm where lift originates',
    ].join('\n');
  }

  if (p.includes('note')) {
    return 'I’ve added a notes placeholder. Jot down insights, blockers, and follow-ups after each deploy.';
  }

  // default echo-ish helper
  return `Got it. Here's a quick take on: "${prompt}"\n\n• Key considerations\n• Potential risks\n• Next-step checklist\n\n(Reply generated in mock mode)`;
}

/** Convert OpenAI SSE to a plain text stream */
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

  // ---- MOCK MODE ----
  const mock = isMockEnabled() || !process.env.OPENAI_API_KEY;
  if (mock) {
    const answer = generateMockAnswer(prompt);
    const stream = streamText(answer, 28, 16); // nice readable cadence
    return new Response(stream, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        'x-assistant-mode': 'mock',
      },
    });
  }

  // ---- REAL OPENAI CALL ----
  const apiKey = process.env.OPENAI_API_KEY!;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${apiKey}`,
  };
  if (process.env.OPENAI_ORG_ID) {
    headers['OpenAI-Organization'] = process.env.OPENAI_ORG_ID!;
  }

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
    // Forward 401/429 so the UI can show helpful messages
    const payload = {
      error: 'Upstream error',
      status: upstream.status,
      details: text.slice(0, 500),
    };
    const status = upstream.status === 401 || upstream.status === 429 ? upstream.status : 502;
    return Response.json(payload, { status });
  }

  const stream = sseToTextStream(upstream);
  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'x-assistant-mode': 'live',
    },
  });
}

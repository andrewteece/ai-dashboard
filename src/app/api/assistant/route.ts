import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// import { env } from "@/core/config/env"; // use when we hook OpenAI

const Body = z.object({
  prompt: z.string().trim().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { prompt } = Body.parse(json);

    // TODO: use env.OPENAI_API_KEY w/ OpenAI in a later step
    return NextResponse.json({ answer: `Echo: ${prompt}` });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', issues: err.flatten() },
        { status: 400 },
      );
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

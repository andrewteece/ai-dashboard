import { NextRequest, NextResponse } from "next/server";

type RequestBody = { prompt?: string };

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const prompt = body?.prompt ?? "";
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Placeholder for now; we'll wire OpenAI later.
    return NextResponse.json({ answer: `Echo: ${prompt}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

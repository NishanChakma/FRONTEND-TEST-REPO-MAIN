import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Call OpenRouter API
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          process.env.OPENROUTER_API_KEY ||
          "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" //in real product dont use key in here
        }`, // server-side only
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("OpenRouter API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

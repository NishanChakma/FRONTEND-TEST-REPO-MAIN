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

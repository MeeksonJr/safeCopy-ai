// app/api/extension/analyze/route.ts

import { analyzeScan } from "@/app/actions/analyze";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { content, industry, organizationId } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required and must be a string." }, { status: 400 });
    }

    // Call the existing analyzeScan server action
    const analysisResult = await analyzeScan(content, industry, organizationId);

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    console.error("Error in extension analysis API:", error);
    return NextResponse.json({ error: "Failed to analyze content." }, { status: 500 });
  }
}

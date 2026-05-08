import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

console.log("API KEY:", process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { results, savings } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are an AI infrastructure cost optimization expert.

Analyze the following audit results and generate a professional personalized summary in around 100 words.

Audit Results:
${JSON.stringify(results)}

Total Monthly Savings:
$${savings}

Requirements:
- Professional tone
- Clear and concise
- Mention optimization opportunities
- Mention overall savings impact
- Avoid bullet points
`;

    const response =
      await model.generateContent(prompt);

    const summary =
      response.response.text();

    return NextResponse.json({
      summary,
    });
  }

  catch (error) {
    console.log(error);

    return NextResponse.json({
      summary:
        "Your organization may have opportunities to optimize AI tooling expenses through better plan selection and infrastructure optimization strategies.",
    });
  }
}
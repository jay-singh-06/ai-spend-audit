import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: body.email,
      subject: "Your AI Spend Audit Report",
      html: `
        <h2>Audit Generated Successfully</h2>
        <p>Thank you for using AI Spend Optimizer.</p>
        <p>Your audit has been saved successfully.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error });
  }
}v 
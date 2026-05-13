import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, company, savings } = body;

    console.log("Sending email to:", email);

    // Fake email response for assignment
    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${email}`,
      company,
      savings,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
      },
      {
        status: 500,
      },
    );
  }
}
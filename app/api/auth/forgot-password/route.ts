import { connectToDB } from "@/lib/mongoose";
import { sendEmail } from "@/lib/sendgmail";
import User from "@/models/User.model";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        {
          error: "email is required",
        },
        {
          status: 400,
        }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          error: "user not found",
        },
        {
          status: 404,
        }
      );
    }
   
    const token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "1h" }
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

    const html = `
    <p>Hello ${user.username}</p>
    <p>You requested to reset your password. </p>
    <p>Click here to reset it : <a href="${resetUrl}">${resetUrl}</a></p>
    <p>Link expires in 1 hour</p>
    `;
    await sendEmail({
      to: user.email,
      subject: "Reset your password - TaskArena",
      html,
    });
    return NextResponse.json(
      {
        message: "Reset Link to email",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Forgot password error : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went while sending the email",
      },
      { status: 500 }
    );
  }
}

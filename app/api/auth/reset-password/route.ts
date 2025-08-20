import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import { ResetPasswordSchema } from "@/validators/User.schema";

export async function POST(req: NextRequest) {
  await connectToDB();
  try {
    const body = await req.json();
    const parsedData = ResetPasswordSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.issues[0].message },
        { status: 400 }
      );
    }

    const { password, token } = parsedData.data;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }

    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 403 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("error while reseting the password : ", error.message);
    return NextResponse.json(
      {
        error:
          error.message || "Something went wrong while resetting the password",
      },
      { status: 500 }
    );
  }
}

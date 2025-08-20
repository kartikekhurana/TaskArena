import { LoginUserSchema } from "@/validators/User.schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User.model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/generateTokens";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const parsedata = LoginUserSchema.parse(body);

    const { email, password } = parsedata;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    const accessToken = generateAccessToken(user._id);
    const refereshToken = generateRefreshToken(user._id);
    const response = NextResponse.json(
      {
        message: "Login succesfull",
        user: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
        },
        token: accessToken,
      },
      { status: 200 }
    );
    const cookieStore = cookies();
    (await cookieStore).set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    return response;
  } catch (error: any) {
    console.error("Login error : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

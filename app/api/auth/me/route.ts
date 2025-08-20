import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        {
          error: "No access Token",
        },
        {
          status: 401,
        }
      );
    }
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as jwt.JwtPayload;
    if (typeof decoded !== "string" && "id" in decoded) {
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return NextResponse.json(
          { error: "Invalid token payload" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          message: "User fetched successfully",
          user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Invalid token payload",
        },
        {
          status: 403,
        }
      );
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "something went wrong while fetching the User",
      },
      { status: 500 }
    );
  }
}

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/lib/generateTokens";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = cookies();
    const refreshToken = (await cookieStore).get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as jwt.JwtPayload;
    console.log("decoded:", decoded);
    if (typeof decoded !== "string" && "id" in decoded) {
      const newAccessToken = generateAccessToken(decoded.id);
      const response = NextResponse.json(
        {
          message: "Access token refresh successfully",
        },
        { status: 200 }
      );
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
      });
      return response;
    } else {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 403 }
      );
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("error while refreshing token : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "Token verification faileds",
      },
      {
        status: 403,
      }
    );
  }
}

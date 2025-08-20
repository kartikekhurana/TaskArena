import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookiestore = cookies();

    (await cookiestore).set("accessToken", "", {
      path: "/",
      expires: new Date(0),
    });
    (await cookiestore).set("refreshToken", "", {
      path: "/",
      expires: new Date(0),
    });
    return NextResponse.json(
      { message: "User logged out succesfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("User logout error : ", error.message);
    return NextResponse.json(
      { message: error.message || "something went wrong" },
      { status: 500 }
    );
  }
}

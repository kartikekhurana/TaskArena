import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.model";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const body = await req.json();

    const { username, avatar, status } = body;
    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...(username && { username }),
      ...(avatar && { avatar }),
      ...(status && { status }),
    });
    if (!updatedUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        message: "user updated successfully",
        user: updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("error while updating the profile : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "soomething went wrong while updating the user",
      },
      {
        status: 500,
      }
    );
  }
}

import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User.model";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const body = await req.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "both old and new passwords are required" },
        { status: 400 }
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return NextResponse.json(
        { message: "incorrect old password" },
        { status: 401 }
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "password changed successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while updating the old password : ", error.message);
    return NextResponse.json(
      {
        error:
          error.message ||
          "something went wrong while updating the old password",
      },
      { status: 500 }
    );
  }
}

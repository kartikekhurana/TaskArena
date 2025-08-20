import { isAdmin } from "@/lib/middlewares/isAdmin";
import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from '@/models/User.model'

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id: requesterId } = await isLoggedIn();
    const admin = await isAdmin(requesterId);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    const { id } = context.params;
    if (requesterId === id) {
      return NextResponse.json(
        { error: "Admins cannot delete themselves here" },
        { status: 400 }
      );
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Something went wrong while deleting the user:",
      error?.message || error
    );
    return NextResponse.json(
      { error: error?.message || "Something went wrong while deleting user" },
      { status: 500 }
    );
  }
}
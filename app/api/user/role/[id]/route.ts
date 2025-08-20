import { isLoggedIn } from "@/lib/middlewares/auth";
import { isAdmin } from "@/lib/middlewares/isAdmin";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const currentUser = await isLoggedIn();
    await isAdmin(currentUser);

    const { id: targetUserId } = await context.params; 
    const { role } = await req.json();

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'user' or 'admin'" },
        { status: 400 }
      );
    }
    const updateUser = await User.findByIdAndUpdate(
      targetUserId,
      { role },
      { new: true }
    ).select("-password");
    if (!updateUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "User role updated successfully",
        user: updateUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error updating user role:", error.message);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong while updating the role",
      },
      {
        status: 500,
      }
    );
  }
}
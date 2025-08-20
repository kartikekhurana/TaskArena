import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/middlewares/isAdmin";
import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User.model";

// No custom interface — Next.js infers context automatically
export async function DELETE(req: NextRequest, context: any) {
  const userIdToDelete = context.params.id;

  try {
    await connectToDB();

    const { id: requesterId } = await isLoggedIn();
    const admin = await isAdmin(requesterId);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    if (requesterId === userIdToDelete)
      return NextResponse.json({ error: "Admins cannot delete themselves" }, { status: 400 });

    const deletedUser = await User.findByIdAndDelete(userIdToDelete);
    if (!deletedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting user:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Something went wrong while deleting user" },
      { status: 500 }
    );
  }
}
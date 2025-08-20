import User from "@/models/User.model";
import Task from "@/models/Task.model";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { isLoggedIn } from "@/lib/middlewares/auth";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await Task.deleteMany({ assigneTo: userId });
    await User.deleteOne();
    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while deleting the account : ", error.message);
    return NextResponse.json(
      {
        error:
          error.message || "something went wrong while deleting the account",
      },
      { status: 500 }
    );
  }
}

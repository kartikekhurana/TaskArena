import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User.model";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const user = await isLoggedIn();

    if (!user || !user.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const existingUser = await User.findById(user.id).select("-password");
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user: existingUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "something" },
      { status: 500 }
    );
  }
}

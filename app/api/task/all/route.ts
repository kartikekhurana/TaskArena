import { isLoggedIn } from "@/lib/middlewares/auth";
import { isAdmin } from "@/lib/middlewares/isAdmin";
import { connectToDB } from "@/lib/mongoose";
import Task from "@/models/Task.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const userId = await isLoggedIn();
    await isAdmin(userId);

    const tasks = await Task.find().populate("assignedTo", "username email");
    return NextResponse.json(
      {
        message: "All tasks fetched succesfully",
        tasks,
      },
      { status: 200 }
    );
  } catch (error : any) {
    console.error("Error while fetching tasks : ", error.message);
    return NextResponse.json(
        {error : error.message || "something went wrong while fetching the task"},
{status:500}
    )
  }
}

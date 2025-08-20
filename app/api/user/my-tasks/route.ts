import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import Task from "@/models/Task.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const tasks = await Task.find({ assignedTo: userId }).sort({ dueDate: 1 });
    if (!tasks) {
      return NextResponse.json({ error: "No task found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        tasks,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "error while fetching the specific user task : ",
      error.message
    );
    return NextResponse.json(
      {
        error:
          error.message || "something went wrong while fetching the user task",
      },
      { status: 500 }
    );
  }
}

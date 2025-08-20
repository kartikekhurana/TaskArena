import { isLoggedIn } from "@/lib/middlewares/auth";
import { isAdmin } from "@/lib/middlewares/isAdmin";
import { connectToDB } from "@/lib/mongoose";
import Task from "@/models/Task.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const user = await isLoggedIn();
    await isAdmin(user);
    const { id: userId } = await context.params; // Fixed: use context.params and await it
    const tasks = await Task.find({ assignedTo: userId }).sort({ dueDate: 1 });
    if (!tasks || tasks.length === 0) { // Fixed: check for empty array too
      return NextResponse.json(
        {
          error: "no tasks assigned",
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        message: "tasks fetched successfully",
        tasks,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "error while fetching the tasks of this user : ",
      error.message
    );
    return NextResponse.json(
      {
        error:
          error.message ||
          "something went wrong while fetching the task of this user",
      },
      {
        status: 500,
      }
    );
  }
}
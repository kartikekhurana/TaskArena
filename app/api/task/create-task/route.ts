import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import Task from "@/models/Task.model";
import { CreateTaskSchema } from "@/validators/Task.Schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const userId = await isLoggedIn();
    const body = await req.json();
    const parseData = CreateTaskSchema.parse(body);

    const newTask = await Task.create({
      ...parseData,
      assigned: userId,
    });
    return NextResponse.json(
      {
        message: "Task created Successfully",
        task: newTask,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Task creation error : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went creating the error",
      },
      {
        status: 500,
      }
    );
  }
}

import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import Task from "@/models/Task.model";
import User from "@/models/User.model";

import { NextRequest, NextResponse } from "next/server";

//admin logic
async function fetchTaskAsAdmin(taskId: string) {
  return await Task.findById(taskId).populate("assignedTo", "username email");
}

//user logic
async function fetchTaskAsUser(taskId: string, userId: string) {
  const task = await Task.findById(taskId).populate(
    "assignedTo",
    "username email"
  );
  if (task && task.assignedTo._id.toString() === userId.toString()) {
    return task;
  }
  return null;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { taskId } = await context.params; // Fixed: use context.params and await it
    let task;
    if (user.role === "admin") {
      task = await fetchTaskAsAdmin(taskId);
    } else {
      task = await fetchTaskAsUser(taskId, userId);
    }
    if (!task) {
      return NextResponse.json(
        { error: "Task not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Task fetched successfully", task },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while fetching the tasks : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went wrong while fetching the tasks",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { taskId } = await context.params; // Fixed: use context.params and await it
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    const isAdmin = user.role === "admin";
    const isAssignee = task.assignedTo.toString() === userId;

    if (!isAdmin && !isAssignee) {
      return NextResponse.json(
        { error: "Unauthorized to update the task" },
        { status: 403 }
      );
    }
    const updates = await req.json();
    if (isAdmin) {
      const allowedFields = [
        "title",
        "description",
        "status",
        "assignedTo",
        "dueDate",
        "priority",
      ];
      allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
          (task as any)[field] = updates[field];
        }
      });
    } else if (isAssignee) {
      if (updates.status) {
        task.status = updates.status;
      } else {
        return NextResponse.json(
          {
            error: "Only status change is Allowed",
          },
          {
            status: 403,
          }
        );
      }
    }
    await task.save();
    return NextResponse.json(
      {
        message: "Task updated successfully",
        updatedTask: task,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("error while updating the task : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went wrong while updating the task",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    const { taskId } = await context.params; // Fixed: use context.params and await it
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    const isAdmin = user.role === "admin";
    const isAssignee = task.assignedTo.toString() === userId;
    if (!isAdmin && !isAssignee) {
      return NextResponse.json(
        { error: "Unauthorized to delete the task" },
        { status: 403 }
      );
    }
    await task.deleteOne();
    return NextResponse.json(
      { message: "task deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while deleting the task : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went wrong while deleting the task ",
      },
      {
        status: 500,
      }
    );
  }
}

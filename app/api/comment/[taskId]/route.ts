import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import Comment from "@/models/Commen.model";
import User from "@/models/User.model";
import Task from "@/models/Task.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  segmentData: any
) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const taskId = segmentData.params.taskId; // Direct access

    const user = await User.findById(userId);
    if (user.role !== "admin") {
      const task = await Task.findById(taskId);
      if (!task || task.assignedTo.toString() !== userId) {
        return NextResponse.json(
          { error: "Unauthorized to view theses comments" },
          { status: 403 }
        );
      }
    }
    
    if (!taskId) {
      return NextResponse.json(
        { error: "Task Id is required" },
        { status: 404 }
      );
    }
    
    const comments = await Comment.find({ taskId })
      .sort({ createdAt: -1 })
      .populate("userId", "username avatar");
      
    return NextResponse.json(
      { message: "Comments fetched successfully", comments },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while fetching comments : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went wrong while fetching the comments",
      },
      { status: 500 }
    );
  }
}
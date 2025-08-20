import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/Commen.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const { taskId, content } = await req.json();

    if (!taskId || !content) {
      return NextResponse.json(
        { error: "taskId and content are required" },
        { status: 400 }
      );
    }
    const comment = await Comment.create({
      taskId,
     userId,
      content,
    });

  const populatedComment = await comment.populate("userId" , "username email")
    return NextResponse.json(
      {
        comment : populatedComment,
        message: "Comment added successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("error while adding the comment : ", error.message);
    return NextResponse.json(
      {
        error: error.message || "something went wrong while adding the comment",
      },
      {
        status: 500,
      }
    );
  }
}

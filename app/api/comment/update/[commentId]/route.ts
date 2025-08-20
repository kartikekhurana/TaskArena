import { isLoggedIn } from "@/lib/middlewares/auth";
import { connectToDB } from "@/lib/mongoose";
import Comment from "@/models/Commen.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const { commentId } = params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        {
          error: "Comment not found",
        },
        {
          status: 404,
        }
      );
    }
    if (comment.userId.toString() !== userId.toString()) {
      return NextResponse.json(
        {
          error: "unauthorized",
        },
        {
          status: 403,
        }
      );
    }
    const body = await req.json();
    const { content } = body;
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "content cannot be empty" },
        {
          status: 400,
        }
      );
    }
    comment.content = content;
    await comment.save();
    return NextResponse.json(
      { error: "Comment updated successfully", comment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while updating comment", error.message);
    return NextResponse.json(
      { error: error.message || "something went wrong updating comment" },
      { status: 500 }
    );
  }
}

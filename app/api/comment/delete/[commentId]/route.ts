import User from "@/models/User.model";
import Comment from "@/models/Commen.model";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { isLoggedIn } from "@/lib/middlewares/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    await connectToDB();
    const { id: userId } = await isLoggedIn();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { commentId } = params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ error: "comment not found" }, { status: 404 });
    }
    const isAdmin = user.role === "admin";
    const isAuthor = comment.userId.toString() === userId;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }
    await comment.deleteOne();
    return NextResponse.json(
      { message: "comment deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error while deleting the comment : ", error.message);
    return NextResponse.json({
      error: error.message || "something went wrong while deleting the comment",
    });
  }
}

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";

export async function DELETE(req, { params }) {
  await connect();

  const { id, commentId } = await params;

  const accessToken = req.headers.get("authorization");
  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized (missing token)" },
      { status: 403 }
    );
  }

  const logginedUserId = accessToken.split(" ")[1]; 
  if (!logginedUserId) {
    return NextResponse.json(
      { error: "Unauthorized (invalid token)" },
      { status: 403 }
    );
  }

  try {
    const blog = await Blog.findById(id).populate("comments.user");
    if (!blog) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }

    const commentIndex = blog.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return NextResponse.json(
        { msg: "Comment does not exist" },
        { status: 404 }
      );
    }

    const comment = blog.comments[commentIndex];
    if (comment.user._id.toString() !== logginedUserId) {
      return NextResponse.json(
        { msg: "Only author can delete his/her comment" },
        { status: 403 }
      );
    }

    blog.comments.splice(commentIndex, 1);
    await blog.save();

    return NextResponse.json(
      { msg: "Successfully deleted comment" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ message: "Delete error" }, { status: 500 });
  }
}

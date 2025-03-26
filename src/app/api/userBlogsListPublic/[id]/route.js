import { connect } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connect();

  // console.log("start")

  try {
    const { id } = await params; 

    // console.log("id",id)

    const userBlogList = await Blog.find({ authorId: id })
    .select('title createdAt _id image.url ').sort({ createdAt: -1 });

    if (!userBlogList) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
        userBlogList,
      message: "Fetched successfully",
      success: true
    });

  } catch (error) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
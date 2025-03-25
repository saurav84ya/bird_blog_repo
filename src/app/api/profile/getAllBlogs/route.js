import { connect } from "@/lib/db";
import Blog from "@/models/Blog";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    const accessToken = req.headers.get("authorization");
    
    if (!accessToken) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const tokenParts = accessToken.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return NextResponse.json(
        { message: "Invalid authorization format" },
        { status: 401 }
      );
    }

    const userId = tokenParts[1];
    
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const blogs = await Blog.find({ authorId: userId })
    .select('title createdAt description _id image.id ');  // Remove commas and extra spaces
    
    if (!blogs) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    // console.log("blogs",blogs)

    return NextResponse.json({
        blogs,
      message: " Blogs Fetched successfully",
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

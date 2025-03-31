import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Blog from "@/models/Blog";

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

    const user = await User.findOne({ _id: userId }).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
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

// PUT /api/profile
export async function PUT(req) {
  await connect();

  try {
    const accessToken = req.headers.get("authorization");
    const tokenParts = accessToken.split(" ");
    const userId = tokenParts[1];

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const { name, email, about ,location , age ,designation  } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, about ,location , age ,designation },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
      success: true
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Error updating profile", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const accessToken = req.headers.get("authorization");
    
    if (!accessToken) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Extracting userId (Assuming token format is "Bearer <userId>")
    const userId = accessToken.split(" ")[1];
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 400 }
      );
    }

    // Delete User and All Their Blogs
    await User.findByIdAndDelete(userId);
    await Blog.deleteMany({ authorId: userId }); // ✅ Fixing deletion query

    return NextResponse.json({
      message: "User and all their blogs deleted successfully",
      success: true
    });

  } catch (error) {
    console.error("Error deleting user:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
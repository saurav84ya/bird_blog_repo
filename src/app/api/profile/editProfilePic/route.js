import { connect } from "@/lib/db";
import User from "@/models/User"; // Make sure to import User model
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connect();

  try {
    const { image, id } = await req.json();
    
    // console.log("Received data:", { image, id });

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Actual update operation (uncommented)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { avatar: image?.url }, // Assuming 'avatar' is the field name
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    console.log("updatedUser",updatedUser)
    

    return NextResponse.json({
      user: "updatedUser",
      message: "Profile picture updated successfully",
      success: true
    });

  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json(
      { message: "Error updating profile picture", error: error.message },
      { status: 500 }
    );
  }
}
import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connect();

  try {
    const { id } = await params; // No need for 'await' here

    // Validate ID format if needed
    // if (!isValidObjectId(id)) { ... }

    const userDetail = await User.findOne({ _id: id }).select('-password'); // Exclude sensitive data

    if (!userDetail) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 } // 404 is more appropriate for "not found"
      );
    }

    return NextResponse.json({
      userDetail,
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
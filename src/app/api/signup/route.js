import User from "@/models/User";
import bcrypt from "bcrypt";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connect();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ status: 201, message: "Registration Successful", success: true, newUser });
  } catch (error) {
    return NextResponse.json({ message: "Signup Error", success: false });
  }
}

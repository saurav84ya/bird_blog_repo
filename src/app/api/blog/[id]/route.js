// http://localhost:3000/api/blog/someid

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";

export async function PUT(req, {params}) {
  await connect();

  const {id} =  await params;

  const accessToken = req.headers.get("authorization");
  const autherId = accessToken.split(" ")[1];

  // const decodedToken = verifyJwtToken(token);

  if (!autherId) {
    return NextResponse.json(
      { error: "unauthorized (wrong or expired token)" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const blog = await Blog.findById(id).populate("authorId");

    if (blog?.authorId?._id.toString() !== autherId.toString()) {
      return NextResponse.json(
        { msg: "Only author can update his/her blog" },
        { status: 403 }
      );
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: { ...body } },
      { new: true }
    );

    return NextResponse.json(updateBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "PUT error" }, {status: 500});
  }
}

export async function DELETE(req, {params}) {
    await connect();
  
    const {id} =  await params;
    const accessToken = req.headers.get("authorization");
    const autherId = accessToken.split(" ")[1];
  
    // const decodedToken = verifyJwtToken(token);
  
    if (!autherId) {
      return NextResponse.json(
        { error: "unauthorized (wrong or expired token)" },
        { status: 403 }
      );
    }
  
    try {
      const blog = await Blog.findById(id).populate("authorId");
  
      if (blog?.authorId?._id.toString() !== autherId) {
        return NextResponse.json(
          { msg: "Only author can delete his/her blog" },
          { status: 403 }
        );
      }``
  
      await Blog.findByIdAndDelete(id)
  
      return NextResponse.json({msg: "Successfully deleted blog"}, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Delete error" }, {status: 500});
    }
  }


  
export async function GET(req, { params }) {
  await connect();

  const {id} = await params;

  // console.log("chdjs",id)

  try {
    const blog = await Blog.findById(id)
      .populate({
        path: "authorId",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "GET error" },
      {
        status: 500,
      }
    );
  }
}

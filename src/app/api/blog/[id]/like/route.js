// http://localhost:3000/api/blog/blogid/like

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function PUT(req, {params}) {
  await connect();

  const {id} = await params;
  const accessToken = req.headers.get("authorization");
  const userIdWhoLiked = accessToken.split(" ")[1];

  // console.log("emailOfUserWhoLIkes",emailOfUserWhoLIkes , id)

  if (!userIdWhoLiked) {
    return NextResponse.json(
      { error: "unauthorized (wrong or expired token)" },
      { status: 403 }
    );
  }

  try {
    const blog = await Blog.findById(id);
    // const userWhoLiked = await  User.findOne({email : emailOfUserWhoLIkes})

    // console.log("userWhoLiked" , blog)

    if(blog.likes.includes(userIdWhoLiked)) {
        blog.likes = blog.likes.filter(id => id.toString() !== userIdWhoLiked.toString());
    } else {
        blog.likes.push(userIdWhoLiked)
    }

    await blog.save();


    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.log("err",error)
    return NextResponse.json({ message: "PUT error" }, {status: 500});
  }
}
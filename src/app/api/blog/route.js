// http://localhost:3000/api/blog

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function POST(req) {
  await connect();

  // const accessToken = req.headers.get("authorization");
  // const token = accessToken.split(" ")[1];

  // const decodedToken = verifyJwtToken(token);

  // if (!accessToken || !decodedToken) {
  //   return new Response(
  //     JSON.stringify({ message: "unauthorized (wrong or expired token" , success : false  }),
  //     { status: 403 }
  //   );
  // }

  try {
    const body = await req.json();

    // console.log("body",body.authorEmail)

    const autherEMAIL = body?.authorEmail

    const user = await User.findOne({email : autherEMAIL})

    const xy = {
      title: body.title,
      description: body.description,
      excerpt: body.excerpt,
      quote: body.quote,
      category: body.category,
      image: {
        id: body.image.id,
        url: body.image.url    
      },
      authorId: user._id
    }


    const newblog = await Blog.create(xy);

    return NextResponse.json({newblog , success : true , message : "blog created and uploaded succesfully"  , status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "POST error (create blog)" });
  }
}

export async function GET(req) {
  await connect();

  try {
    const blogs = await Blog.find({})
      .populate({
        path: "authorId",
        select: "-password",
      })    
      .sort({ createdAt: -1 });

      return NextResponse.json({blogs , message : "fetched succesfully" , success : true });
  } catch (error) {
    return NextResponse.json(
      { message: "GET error" },
      {
        status: 500,
      }
    );
  }
}

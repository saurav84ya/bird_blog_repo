// http://localhost:3000/api/blog

import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function POST(req) {
  await connect();
  try {
    const body = await req.json();

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



// export async function GET(req) {
//   await connect();

//   try {
//     const blogs = await Blog.find({})
//       .populate({
//         path: "authorId",
//         select: "-password",
//       })    
//       .sort({ createdAt: -1 });

//       return NextResponse.json({blogs , message : "fetched succesfully" , success : true });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "GET error" },
//       {
//         status: 500,
//       }
//     );
//   }
// }


export async function GET(req) {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit =7;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();
    const blogs = await Blog.find({})
      .populate({ path: "authorId", select: "-password" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      blogs,
      totalPages: Math.ceil(totalBlogs / limit),
      currentPage: page,
      message: "Fetched successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ message: "GET error" }, { status: 500 });
  }
}

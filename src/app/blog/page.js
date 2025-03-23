import React from "react";
import FirstBlog from "@/components/FirstBlog";
import OtherBlogs from "@/components/OtherBlogs";
import demoImage from '../../../public/img/demoImage.png'

async function fetchBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog`, {
    cache: "no-store",
  });

  // console.log("res",res)


  return res.json();
}

const Blog = async () => {
  const {blogs} = await fetchBlogs();

  // console.log("blogs",blogs)

  const firstBlog = blogs && blogs[0];
  const otherBlogs = blogs?.length > 0 && blogs.slice(1)

  // console.log("firstBlog",firstBlog)
  return (
    <div className="max-w-[1000px] mx-auto" >
      {blogs?.length > 0 ? (
        <>
        <div className="container  ">
          <h2 className="text-center my-10">
            <span className="text-primaryColor"><span className="special-word" >T</span>rending</span>{" "}
            <span className="special-word" >B</span>log
          </h2>
          <FirstBlog firstBlog={firstBlog} demoImage={demoImage}  />
          <OtherBlogs otherBlogs={otherBlogs} demoImage={demoImage} />
        </div>
        </>
      ) : (
        <h3>No Blogs...</h3>
      )}
    </div>
  );
};

export default Blog;

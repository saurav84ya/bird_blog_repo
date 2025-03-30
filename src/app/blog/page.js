import React from "react";
import FirstBlog from "@/components/FirstBlog";
import OtherBlogs from "@/components/OtherBlogs";
import demoImage from "../../../public/img/demoImage.png";
import Pagination from "@/components/Pagination";
async function fetchBlogs(page = 1) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog?page=${page}`,
    { cache: "no-store" }
  );
  return res.json();
}

const Blog = async ({ params, searchParams }) => {

  const xyz = await searchParams
  const page =   Number(xyz?.page) || 1;
  if (page < 1) return notFound(); 

  const { blogs, totalPages } = await fetchBlogs(page);

  const firstBlog = blogs && blogs[0];
  const otherBlogs = blogs?.length > 0 ? blogs.slice(1) : [];

  return (
    <div className="max-w-[1000px] mx-auto px-3 md:px-5  ">
      {blogs?.length > 0 ? (
        <>
          <FirstBlog firstBlog={firstBlog} demoImage={demoImage} />
          <OtherBlogs otherBlogs={otherBlogs} demoImage={demoImage} />
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      ) : (
        <p className="text-center">No blogs found.</p>
      )}
    </div>
  );
};

export default Blog;
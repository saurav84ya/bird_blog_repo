"use client";

import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import demoImage from "../../../../public/img/demoImage.png";
import { deletePhoto } from "@/actions/uploadActions";



import {
  AiFillDelete,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiTwotoneCalendar,
} from "react-icons/ai";

import { BsFillPencilFill, BsTrash } from "react-icons/bs";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

const BlogPage = () => {

  const { data: session, status } = useSession();
  const params = useParams();
  const id = params?.id; // Ensure ID is retrieved properly
  const router = useRouter()


  const [blogDetails, setBlogDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);
  const [blogComments, setBlogComments] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);


  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  // console.log("Session:", session);
  // console.log("Blog Details:", blogDetails);

  // Fetch Blog Data
  async function fetchBlog() {
    if (!id) return; // Ensure ID is available before making the request
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blog data");
      }
      const blog = await response.json();
      setBlogDetails(blog);
      setIsLiked(blog?.likes?.includes(session?.user?.id));
      setBlogLikes(blog?.likes?.length || 0);
      setBlogComments(blog?.comments?.length || 0);

      // console.log("blog",blog?.likes?.includes(session?.user?.id))


    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  }


  useEffect(() => {
    if (id) fetchBlog();
  }, [id]); // Fetch data when `id` changes

  if (!blogDetails) {
    return <Loader />
  }

  const timeStr = blogDetails?.createdAt;
  const time = moment(timeStr);
  const formattedTime = time.format("MMMM Do YYYY");




  const handleBlogDelete = async (imageId) => {
    try {
      const confirmModal = window.confirm(
        "Are you sure you want to delete your blog?"
      );

      if (confirmModal) {
        setIsDeleting(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog/${params.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session?.user?.id}`,
            },
          }
        );


        if (response?.status === 200) {

          await deletePhoto(imageId);
          toast.success("Blog deleted succesfully")
          router.refresh();
          router.push("/blog");
        }
      }

      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      setIsDeleting(false);

    }
  };

  const handleLike = async () => {
    if (!session?.user) {
      toast.error("Please login before liking.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog/${params.id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.user?.id}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(null),
        }
      );

      if (response.status === 200) {
        setIsLiked((prev) => !prev);
        setBlogLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      } else {
        console.log("Request failed with status:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText) {
      toast.error("comment text is required.");
      return;
    }

    try {
      setIsCommenting(true);

      const newComment = {
        text: commentText,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog/${params.id}/comment`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.id}`,
          },
          method: "POST",
          body: JSON.stringify(newComment),
        }
      );

      if (response?.status === 201) {
        toast.success("Comment created successfully.");
        setTimeout(() => {
          setCommentText("");
          fetchBlog();
        }, 500);
      } else {
        toast.error("Error occurred while creating comment.");
      }
    } catch (error) {
      console.log(error);
    }

    setIsCommenting(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog/${id}/comment/${commentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.id}`,
          },
          method: "DELETE",
        }
      );

      console.log("response", response)

      if (response?.status === 200) {
        fetchBlog();
      } else {
        // console.log("Request failed with status: ", response.status)
        toast.error("Request failed")
      }
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <section className="max-w-[1000px]  mx-auto "  >
      {/* Edit & Delete Options */}
      {blogDetails?.authorId?.email === session?.user?.email && (
        <div className="flex items-center justify-end pr-10  gap-5">
          <Link href={`/blog/edit/${id}`} className="flex items-center gap-1 text-primaryColor">
            <BsFillPencilFill />
            Edit
          </Link>
          <button
            onClick={() => handleBlogDelete(blogDetails?.image?.id)}
            className="flex items-center gap-1 text-red-500"
          >
            <BsTrash />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {/* Blog Author Section */}
      <div className="flex flex-col  items-center justify-center px-5 md:px-10 ">
        <Link href={`/user/${blogDetails?.authorId?._id}`}>
          <div className="flex flex-col justify-center items-center py-10">
            <Image
              src={blogDetails?.authorId?.avatar || demoImage}
              alt="Avatar"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full"
            />
            <div className="text-center">
              <p className="text-whiteColor">{blogDetails?.authorId?.name}</p>
              <p>{blogDetails?.authorId?.designation}</p>
            </div>
          </div>
        </Link>

        {/* Blog Details */}
        <div className="text-center space-y-3 ">
          <h2>{blogDetails?.title}</h2>
          <p>{blogDetails?.excerpt}...</p>
          <p className="flex items-center justify-center gap-3">
            <span className="text-primaryColor">{blogDetails?.category}</span>
            <span className="flex items-center gap-1">
              <AiTwotoneCalendar />
              {formattedTime}
            </span>
          </p>

          {/* Blog Image */}
          <div>
            <Image
              src={blogDetails?.image?.url || demoImage}
              alt="Blog Image"
              width={600}
              height={400}
              className="w-full h-auto rounded-3xl mt-5"
            />
          </div>

          {/* Blog Description */}
          <div className="text-start">
            <div className="space-y-5">
              {blogDetails?.description &&
                blogDetails?.description.split("\n").map((paragraph, index) => (
                  <div key={index}>
                    {/* Insert Quote in the Middle of the Content */}
                    {index === Math.floor(blogDetails?.description.split("\n").length / 2) && (
                      <blockquote className="border-l-4 border-primaryColor border-spacing-6 italic mb-5">
                        <p className="ml-5">{blogDetails?.quote}</p>
                      </blockquote>
                    )}
                    {paragraph}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>


      {/* like  comment section */}

      <div className="py-12">
        <div className="flex gap-10 items-center text-xl justify-center">
          <div className="flex items-center gap-1">
            <p>{blogLikes}</p>

            {isLiked ? (
              <AiFillHeart
                onClick={handleLike}
                size={20}
                color="#ed5784"
                cursor="pointer"
              />
            ) : (
              <AiOutlineHeart onClick={handleLike} size={20} cursor="pointer" />
            )}
          </div>

          <div className="flex items-center gap-1">
            <p>{blogComments}</p>

            <AiOutlineComment size={20} />
          </div>
        </div>
      </div>






      {/* comments section */}


      <div className="  md:px-5 px-2 " >


        {!session?.user && (
          <h3 className="text-red-500">Kindly login to leave a comment.</h3>
        )}

        {session?.user && (
          <div className=" flex justify-center pb-5 " >

            <form onSubmit={handleCommentSubmit} className="w-[80%] md:w-[70%] ld:w-[50%] ">
              <Input
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText}
                name="comment"
                type="text"
                placeholder="Type message..."
              />

              <button disabled={isCommenting} type="submit" className="btn  bg-blue-500
               p-3 rounded-md ml-5 mt-3 font-bold hover:bg-blue-400 cursor-pointer ">
                {isCommenting ? "Loading..." : "Comment"}
              </button>
            </form>
          </div>
        )}

        {blogDetails?.comments && blogDetails?.comments.length === 0 && (
          <p>No comments</p>
        )}

        {blogDetails?.comments && blogDetails?.comments.length > 0 && (
          <>

            {blogDetails.comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 py-5 pl-2 md:pl-10 lg:pl-20 items-center">
                <Image
                  src={comment?.user?.avatar?.url ? comment?.user?.avatar?.url : demoImage}
                  alt="avatar image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <p className="text-whiteColor">{comment?.user?.name}</p>
                  <p>{comment.text}</p>
                </div>

                {session?.user?.id === comment?.user?._id && (

                  <BsTrash onClick={() => handleDeleteComment(comment._id)} cursor="pointer" className="text-red-500 ml-10" />
                )}

              </div>
            ))}
          </>
        )}
      </div>




    </section>
  );
};

export default BlogPage;

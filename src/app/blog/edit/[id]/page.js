"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import TextArea from "@/components/TextArea";
import Image from "next/image";
import { deletePhoto } from "@/actions/uploadActions";
import toast from "react-hot-toast";

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Songbirds",
  photo: {},
  blogId: "",
  newImage: "",
};

const EditBlog = ({ params }) => {

  const {id} =   React.use(params)

  const [state, setState] = useState(initialState);

  const [isLoading, setIsLoading] = useState(false);
// console.log(state)
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog/${id}`);

        if (res.status === 200) {
          const blogData = await res.json();

          setState((prevstate) => ({
            ...prevstate,
            title: blogData.title,
            description: blogData.description,
            excerpt: blogData.excerpt,
            quote: blogData.quote,
            category: blogData.category,
            photo: blogData.image,
            blogId: blogData._id,
          }));
        } else {
          toast.error("Error fetching blog data");
        }
      } catch (error) {
        toast.error("Error fetching blog data");
      }
    }

    fetchBlog();
  }, [id]);

  if (status === "loading") {
    return <p>loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access denied</p>;
  }

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newImage, title, category, description, excerpt, quote } = state;

    if (!title || !description || !category || !excerpt || !quote) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (newImage) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (newImage.size > maxSize) {
        toast.error("File size is too large. Please select a file under 5MB.");
        return;
      }
    }

    if (title.length < 4) {
      toast.error("Title must be at least 4 characters long.");
      return;
    }

    if (description.length < 20) {
      toast.error("Description must be at least 20 characters long.");
      return;
    }

    if (excerpt.length < 10) {
      toast.error("Excerpt must be at least 10 characters long.");
      return;
    }

    if (quote.length < 6) {
      toast.error("Quote must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);

      let image;

      if (state.newImage) {
        image = await uploadImage();

        if (state.photo?.id) {
          await deletePhoto(state.photo.id);
        }
      } else {
        image = state.photo;
      }

      const updateBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.id}`,
          },
          method: "PUT",
          body: JSON.stringify(updateBlog),
        }
      );

      if (response?.status === 200) {
        toast.success("Blog updated successfully.");
        setTimeout(() => {
          router.refresh();
          router.push(`/blog/${id}`);
        }, 1500);
      } else {
        toast.error("Error occurred while updating blog.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while updating blog.");
    }

    setIsLoading(false);
  };

  const uploadImage = async () => {
    if (!state.newImage) return;

    const formdata = new FormData();

    formdata.append("file", state.newImage);
    formdata.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);

    // console.log("run")

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await res.json();

      // console.log("data",data)
      const image = {
        id: data["public_id"],
        url: data["secure_url"],
      };

      return image;
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancleUploadImg = () => {
    setState({ ...state, ["newImage"]: "" });
  };

  return (
    <div className="container w-[1000px] mx-auto ">
      <h2 className="mb-5">
        <span className="special-word">Edit</span> Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title"
          type="text"
          name="title"
          placeholder="Write you title here..."
          onChange={handleChange}
          value={state.title}
        />

        <TextArea
          label="Description"
          rows="4"
          name="description"
          placeholder="Write you description here..."
          onChange={handleChange}
          value={state.description}
        />

        <TextArea
          label="Excerpt"
          rows="2"
          name="excerpt"
          placeholder="Write you excerpt here..."
          onChange={handleChange}
          value={state.excerpt}
        />

        <TextArea
          label="Quote"
          rows="2"
          name="quote"
          placeholder="Write you quote here..."
          onChange={handleChange}
          value={state.quote}
        />

        <div className="" >
          <label className="block">Select an option</label>
          <select
            name="category"
            onChange={handleChange}
            value={state.category}
            className="block rounded-lg w-full p-3 bg-[#1E3035]"
          >
            <option value="Songbirds">Songbirds</option>
            <option value="Waterfowl">Waterfowl</option>
            <option value="Parrots">Parrots</option>
            <option value="Seabirds">Seabirds</option>
            <option value="Gamebirds">Gamebirds</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-bold">Upload Image</label>

          <input
            onChange={handleChange}
            type="file"
            name="newImage"
            accept="image/*"
          />

          {state.newImage ? (
            <div>
              <Image
                src={URL.createObjectURL(state.newImage)}
                priority
                alt="Sample image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-32 mt-5"
              />

              <button onClick={handleCancleUploadImg}>Cancle</button>
            </div>
          ) : (
            <div>
              {state.photo && state.photo["url"] && (
                <div>
                  <Image
                    src={state.photo.url}
                    priority
                    alt="Sample image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-32 mt-5"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        

        <button  disabled= {isLoading} type="submit" className="btn bg-blue-600 hover:bg-blue-500 font-bold text-white p-3 rounded-3xl w-full cursor-pointer">
          {isLoading ? "Loading..." : "Edit"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;

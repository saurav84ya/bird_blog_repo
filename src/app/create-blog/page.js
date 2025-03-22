"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {  redirect, useRouter } from "next/navigation";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Image from "next/image";
import toast from "react-hot-toast";

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  quote: "",
  category: "Songbirds",
  photo: null,
};

const CreateBlog = () => {
  
   
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();

  // console.log("session",session?.user._id)

   if(!session) redirect ("/login")

  const router = useRouter();

  if (status === "loading") return <div className="w-full 
  flex justify-center items-center  h-[calc(100dvh-8rem)]  " ><p className="text-red-500" >Loading...</p></div>
  if (status === "unauthenticated") return <div className="w-full 
  flex justify-center items-center  h-[calc(100dvh-8rem)]  " ><p className="text-red-500" >Access denied</p></div>

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    setState((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const uploadImage = async () => {
    if (!state.photo) return null;

    const formData = new FormData();
    formData.append("file", state.photo);
    formData.append("upload_preset",process.env.NEXT_PUBLIC_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      // console.log("data",data)

      return { id: data.public_id, url: data.secure_url };
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { photo, title, category, description, excerpt, quote } = state;

      // console.log("photo, title, category, description, excerpt, quote",photo, title, category, description, excerpt, quote)
    if (![title, description, category, excerpt, quote].every(Boolean)) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      toast.error("File size is too large. Please select a file under 5MB.");
      return;
    }

    try {
      setIsLoading(true);
      const image = await uploadImage();

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          excerpt,
          quote,
          category,
          image,
          authorEmail: session?.user?.email,
        }),
      });

      // console.log("response",response)

      if (response.ok) {
        toast.success("Blog created successfully.");
        router.refresh();
        router.push("/blog");
      } else {
        toast.error("Error occurred while creating blog.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while creating blog.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container w-[1000px]">
      <h2 className="mb-5">
        <span className="special-word">Create</span> Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 border p-5 rounded-4xl border-gray-600">
        <Input label="Title" type="text" name="title" placeholder="Write your title here..." onChange={handleChange} value={state.title} />
        <TextArea label="Description" rows="4" name="description" placeholder="Write your description here..." onChange={handleChange} value={state.description} />
        <TextArea label="Excerpt" rows="2" name="excerpt" placeholder="Write your excerpt here..." onChange={handleChange} value={state.excerpt} />
        <TextArea label="Quote" rows="2" name="quote" placeholder="Write your quote here..." onChange={handleChange} value={state.quote} />

        <div>
          <label className="block ml-5">Select an option</label>
          <select name="category" onChange={handleChange} value={state.category} className="block rounded-lg w-full mt-3 p-3 bg-[#1E3035]">
            {["Songbirds", "Waterfowl", "Parrots", "Seabirds", "Gamebirds"].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="md:pl-5 pl-0">
          <label className="block mb-2 text-sm font-medium">Upload Image</label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} className="bg-[#1E3035] cursor-pointer py-3 md:p-3 rounded-xl" />
          {state.photo && (
            <Image src={URL.createObjectURL(state.photo)} priority alt="Sample image" width={0} height={0} sizes="100vw" className="w-32 mt-5" />
          )}
        </div>

        <button disabled={isLoading} type="submit" className="btn bg-blue-600 hover:bg-blue-500 font-bold text-white p-3 rounded-3xl w-full cursor-pointer">
          {isLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </section>
  );
};

export default CreateBlog;

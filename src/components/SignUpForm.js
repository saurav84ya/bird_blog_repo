"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react"; // ✅ Fixed Import
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function SignUpForm() {
  const initialState = {
    name: "",
    email: "",
    password: "",
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = state;

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    // Email Validation
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);

      const newUser = { name, email, password };

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_URL}/api/signup`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      // console.log("data",data)

      if (data?.success) {
        toast.success(data?.message);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };


  const notAvlible = () => {
    toast.success("Plz use Google for SignUp ");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-80 md:w-96">
        <h2 className="text-2xl font-bold text-center text-orange-400 mb-5">Sign up</h2>

        <div  className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              value={state.name}
              onChange={handleChange}
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 outline-none focus:border-orange-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              value={state.email}
              onChange={handleChange}
              type="email"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 outline-none focus:border-orange-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              name="password"
              value={state.password}
              onChange={handleChange}
              type="password"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 outline-none focus:border-orange-400"
              placeholder="Enter your password"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            onClick={notAvlible}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>

          {/* GitHub Sign Up Button */}
          
        </div>
       
<div className="flex flex-col gap-4 mt-6">
  {/* GitHub Button */}
 

  {/* Google Button */}
  <button
    onClick={() => signIn("google")}
    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-md transition duration-300 shadow-md w-full border border-gray-300"
  >
    <FaGoogle className="text-red-500 text-xl" /> Sign Up with Google
  </button>
</div>
        {/* Already a user */}
        <p className="text-center text-sm mt-4">
          Already a user? <Link href="/login" className="text-orange-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

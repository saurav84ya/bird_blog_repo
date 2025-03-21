"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import toast from "react-hot-toast";

export default function SignUpForm() {
  const initialState = {
    name: "",
    email: "",
    password: "",
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Define router

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
      
      const data = await response.json();  // Extract JSON response
      
      // console.log("Response Status:", response.status);
      // console.log("Response Data:", data);

      if (data?.succes) {
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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-80 md:w-96">
        <h2 className="text-2xl font-bold text-center text-orange-400 mb-5">Sign up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {/* Already a user */}
        <p className="text-center text-sm mt-4">
          Already a user? <Link href="/login" className="text-orange-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

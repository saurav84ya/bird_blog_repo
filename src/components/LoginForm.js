"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";

const initialState = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // ✅ Use router for navigation

  // ✅ Handle input changes
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  // ✅ Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = state;

    // ✅ Basic validation checks
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }


    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevents auto-redirect
      });

      if (!res.ok || res.error) {
        toast.error("Invalid Credentials");
        setIsLoading(false);
        return;
      }

      toast.success("Login successful! Redirecting...");
      router.push("/"); // ✅ Redirect after successful login
    } catch (error) {
      // console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-80 md:w-96">
        <h2 className="text-2xl font-bold text-center text-orange-400 mb-5">Log In</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email" // ✅ Added
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
              name="password" // ✅ Added
              value={state.password}
              onChange={handleChange}
              type="password"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 outline-none focus:border-orange-400"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>

        </form>

        <div className="flex flex-col gap-4 mt-10">
  {/* GitHub Button */}


  {/* Google Button */}
  <button
    onClick={() => signIn("google")}
    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-gray-900 font-semibold py-2 rounded-md transition duration-300 shadow-md w-full border border-gray-300"
  >
    <FaGoogle className="text-red-500 text-xl" /> Sign in with Google
  </button>
</div>

        {/* Signup Link */}
        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orange-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

import Image from "next/image";
import React from "react";
import { FaInstagram , FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121d1e] p-6">
      {/* Main Card */}
      <div className="bg-[#1c2a2c] shadow-lg rounded-2xl p-6 max-w-md text-center border border-gray-700">
        
        {/* FeatherVerse Section */}
        <h1 className="text-3xl font-bold text-white">About FeatherVerse 🕊️</h1>
        <p className="text-gray-300 mt-2">
          FeatherVerse is a **social blogging platform** for bird lovers! 🦜🦉  
          Discover, share, and engage with **unique bird blogs**, like & comment on posts,  
          and even create your own. 🚀  
        </p>

        <hr className="my-4 border-gray-600" />

        {/* Saurav's Profile Section */}
        <Image
        height={100}
        width={100}
          src={"https://res.cloudinary.com/drrwidoo4/image/upload/v1743219923/qu2fkcs6sdzxffxkbesf.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-400"
        />
        <h2 className="text-2xl font-bold text-white">Saurav Chaurasia</h2>
        <p className="text-gray-300">
          Hi! I&#39;m a full-stack developer building modern web experiences. **FeatherVerse**  
          is my latest project, powered by Next.js, MongoDB, and NextAuth. ✨
        </p>

        {/* Social Links */}
        <div className="mt-4 flex flex-col gap-3">
          <a
            href="https://www.instagram.com/saurav_8.4ya/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-full text-lg shadow-md 
            hover:bg-pink-600 hover:shadow-pink-500/50 transition duration-300"
          >
            <FaInstagram className="mr-2 text-xl" /> Instagram
          </a>

          <a
            href="https://github.com/saurav84ya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-full text-lg shadow-md 
            hover:bg-gray-700 hover:shadow-gray-500/50 transition duration-300"
          >
            <FaGithub className="mr-2 text-xl" /> GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/saurav-chaurasia-1017192b8/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-full text-lg shadow-md 
            hover:bg-blue-700 hover:shadow-blue-500/50 transition duration-300"
          >
            <FaLinkedin className="mr-2 text-xl" /> LinkedIn
          </a>

          <a
            href="mailto:sauravchaurasia468@gmail.com"
            className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-full text-lg shadow-md 
            hover:bg-green-700 hover:shadow-green-500/50 transition duration-300"
          >
            <FaEnvelope className="mr-2 text-xl" /> Email Me
          </a>
        </div>
      </div>
    </div>
  );
}


export function generateMetadata() {
  return {
    title: "About FeatherVerse - A Social Blogging Platform for Bird Lovers",
    description:
      "Learn more about FeatherVerse, a unique social blogging platform dedicated to bird enthusiasts. Created by Saurav Chaurasia, FeatherVerse allows users to explore, create, and engage with bird-related content.",
    openGraph: {
      title: "About FeatherVerse - A Social Blogging Platform for Bird Lovers",
      description:
        "Discover FeatherVerse, a blogging platform for bird lovers. Read, write, and share your passion for birds with a like-minded community.",
      url: "https://featherverse.vercel.app/about",
      type: "website",
      images: [
        {
          url: "https://res.cloudinary.com/drrwidoo4/image/upload/v1743219923/qu2fkcs6sdzxffxkbesf.png",
          width: 1200,
          height: 630,
          alt: "FeatherVerse - Bird Blogging Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About FeatherVerse",
      description:
        "FeatherVerse is a social blogging platform for bird lovers. Explore, create, and engage with bird-related blogs.",
      images: [
        "https://res.cloudinary.com/drrwidoo4/image/upload/v1743219923/qu2fkcs6sdzxffxkbesf.png",
      ],
    },
  };
}

import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="container h-screen flex flex-col gap-6 justify-center items-center text-center">
      <h2 className="text-4xl md:text-6xl font-bold text-red-500">404 - Not Found</h2>
      <p className="text-lg md:text-xl text-gray-400">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="bg-primaryColor text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-primaryColorLight transition-all duration-300"
      >
        Return Home
      </Link>
    </div>
  );
}

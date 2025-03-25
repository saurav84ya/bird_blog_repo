"use client"

import React, { useEffect, useState } from 'react'

export default function DeletAllBlogs({deleteShow , setDeletShow}) {


    

  const [countdown, setCountdown] = useState(null); 
  const [showConfirm, setShowConfirm] = useState(false);
  


  const startTimer = () => {
    setCountdown(3); // Start 30-sec timer
    setShowConfirm(false); // Hide confirm button initially
  };

  useEffect(() => {
    if (countdown === null) return; 
    if (countdown === 0) {
      setShowConfirm(true); // Show confirm button after 30 sec
      return;
    }
  
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);
  

  // console.log("dd",countdown)


 





  return (
    <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Recent Blogs</h2>
          <button onClick={() =>startTimer() }  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
            Delete All Blogs
          </button>
        </div>
  )
}

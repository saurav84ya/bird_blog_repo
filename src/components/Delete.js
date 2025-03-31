"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function DeleteAllBlogs({ session }) {
  const [countdown, setCountdown] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState(null);

  // Function to open the dialog and start the timer
  const openDialog = (type) => {
    setDeleteType(type);
    setShowConfirm(true);
    setCountdown(30); // Start 30-sec countdown
  };

  useEffect(() => {
    if (countdown === null || !showConfirm) return;
    if (countdown === 0) return;

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, showConfirm]);

  // Function to close the dialog and reset state
  const closeDialog = () => {
    setShowConfirm(false);
    setCountdown(null);
    setDeleteType(null);
  };

  // Function to handle delete action
  const handleDelete = async () => {
    if (deleteType === "blogs") {
      await deleteAllBlogs();
    } else if (deleteType === "account") {
      await deleteAccount();
    }
    closeDialog();
  };

  // Delete all blogs function
  const deleteAllBlogs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.id}`,
          },
        }
      );

      if (response.ok) {
        toast.success("All Blogs deleted successfully! ");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete Blogs");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/profile`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.id}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Account deleted successfully! Redirecting...");
        setTimeout(() => (window.location.href = "/"), 2000);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="border-t border-red-200 pt-6">
      <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700 mb-4 text-center">
          These actions are irreversible. Please proceed with caution.
        </p>

        <div className="flex justify-around">
          <button
            onClick={() => openDialog("blogs")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete All Blogs
          </button>
          <button
            onClick={() => openDialog("account")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete Your Account
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 m-5 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4 text-red-600">
              Are you sure you want to delete your{" "}
              {deleteType === "blogs" ? "blogs" : "account"}?
            </h2>
            <p className="text-gray-600 mb-4">
              {countdown > 0
                ? `Please wait ${countdown} seconds before confirming.`
                : "You can now proceed."}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={closeDialog}
                className="md:px-4 px-2 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                disabled={countdown > 0}
                className="md:px-4 px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-gray-400"
              >
                {countdown > 0 ? `Yes (${countdown}s)` : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

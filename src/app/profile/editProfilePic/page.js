"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function UploadPage() {
  const { data: session } = useSession();
  const id = session?.user?.id;

  if(!session) redirect ("/login")

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large! Select a file under 5MB.");
        return;
      }
      setPhoto(file);
    }
  };

  const router = useRouter()
  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!photo) return null;

    const formData = new FormData();
    formData.append("file", photo);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return { id: data.public_id, url: data.secure_url };
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed.");
      return null;
    }
  };

  // Handle Upload Button Click
  const handleUpload = async () => {
    if (!photo) {
      toast.error("Please select an image first!");
      return;
    }

    try {
        setLoading(true);
        const image = await uploadImage();

        
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_URL}/api/profile/editProfilePic`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              // Add authorization if needed:
              // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              image: image , // Should be the real image data
              id:id // Should be the real user ID
            }),
          });
  
        // console.log("response",response)
  
        if (response.ok) {
            toast.success("Image uploaded successfully! 🎉");
            router.push('/profile')
          } else {
            toast.error("Error while uploading image.");
          }
  

      } catch (error) {
        console.error(error);
        toast.error("Error occurred while creating blog.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-white mb-4">Upload Image</h2>

        {/* File Input */}
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Choose an image (Max 5MB)
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm p-2 bg-gray-700 text-white rounded-lg cursor-pointer focus:outline-none"
        />

        {/* Image Preview */}
        {photo && (
          <div className="mt-4">
            <Image
              src={URL.createObjectURL(photo)}
              alt="Preview"
              width={150}
              height={150}
              className="w-32 h-32 object-cover rounded-lg mx-auto"
            />
            <p className="text-gray-400 text-sm mt-2">{photo.name}</p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

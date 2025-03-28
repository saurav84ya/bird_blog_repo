  "use client"
 
 import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import { deletePhoto } from '@/actions/uploadActions';
import DeletAllBlogs from '@/components/DeletAllBlogs';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const id = session?.user?.id;
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ isBlogLoading,setIsBlogsLoading] = useState(false)

//   console.log("v",isBlogLoading)
   const [isDeleting , setIsDeleting] = useState(false)
  const [blogList , setBlogList] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    about: '',
    age : '',
    avatar : '',
    createdAt : '',
    designation : '',
    location : ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserBlogs = async () => {
    try {
        if(!id) return

        setIsBlogsLoading(true)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/profile/getAllBlogs`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${id}`,
              },
            }
          );

          
      if (!response.ok) {
        toast.error('Failed to fetch user details');
       }
 
       const data = await response.json();

    //    console.log('data',data.blogs)

       setBlogList(data?.blogs)
       setIsBlogsLoading(false)


    } catch (error) {

        console.log("error",error)
        setIsBlogsLoading(false)

        
    }
  }

  const fetchUserDetails = async () => {
    fetchUserBlogs()
    try {
      if (!id) return;
      
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${id}`,
          },
        }
      );

      if (!response.ok) {
       toast.error('Failed to fetch user details');
      }

      const data = await response.json();

    //   console.log("data",data)
      setFormData({
        name: data.user.name ||  '',
        email:  data.user.email || '',
        about: data.user.about || '',
        age : data.user.age || '',
        avatar : data.user.avatar || '',
        createdAt : data.user.createdAt || '',
        designation :  data.user.designation || '',
        location : data.user.location || ''
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    toast.error("Error fetching user details")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };







  const [deleteShow , setDeletShow] = useState(false)
//   console.log("deleteShow",deleteShow)

  const deletAllBlogs = async () => {
    // console.log("deleted")
  }




























  const handleBlogDelete = async (imageId) => {
    try {
      const confirmModal = window.confirm(
        "Are you sure you want to delete your blog?"
      );

      if (confirmModal) {
        setIsDeleting(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/blog/${params.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${id}`,
            },
          }
        );


        if (response?.status === 200) {

          await deletePhoto(imageId);
          toast.success("Blog deleted succesfully")
          fetchUserBlogs()
        }
      }

      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      setIsDeleting(false);

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTED_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${id}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        toast.error('Failed to update profile');
      }

      const data = await response.json();
    //   console.log("updateddata",data)
      setIsEditModalOpen(false);
      fetchUserDetails(); // Refresh user data
    } catch (error) {
      console.error("Error updating profile:", error);
    //   setError(error.message);
    toast.error("Error updating profile:")
    }
  };

  if (status === "loading" || isLoading) {
    return <div className=' h-screen flex justify-center flex-col items-center  '> Loading...</div>;
  }



  if (!session) {
    return <div className=' h-screen flex justify-center flex-col items-center  ' >
        <h1>Please sign in to view your profile</h1>
        <Link href={'/login'} >
            <button className='p-3 bg-blue-600 rounded-sm font-bold cursor-pointer '  > 
                Login
            </button>
        </Link>
    </div>;
  }




  const timeStr = formData?.createdAt;
  const dob = formData?.age
  const age  = moment().diff(moment(dob),'years')
    const time = moment(timeStr);
    const formattedTime = time.format("MMMM Do YYYY");

    // console.log("blogList",blogList)

    function showData(x) {
        const time = moment(x);
        // Includes: Month Day Year + Hours:Minutes AM/PM
        const formattedTime = time.format("MMMM Do YYYY, h:mm:ss a"); 
        return formattedTime;
    }


  return (
    <div className="max-w-[1000px] mx-auto p-4">
      {/* Profile Header */}
      <div className="flex flex-col   w-full md:flex-row gap-8 items-start mb-8">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
          {
            formData.avatar ?  <Image 
            src={formData.avatar || '/default-avatar.png'} 
            alt="profile" 
            width={155} 
            height={155}
            className="rounded-full aspect-square"
          
          />  :<span className="text-4xl">👤</span>
          }
        </div>
        
        {/* User Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{formData.name}</h1>
          <p className="text-gray-600 mb-2">{formData.email}</p>
        {  formData.about && <p className="text-gray-700">Bio: {formData.about}</p>}
          <p className="text-gray-700 mt-2">Member since: { formattedTime}</p>

          <div>
          {  formData.age && <p className="text-gray-700">Age: {age} Years </p>}
          {  formData.location && <p className="text-gray-700">Place: {formData.location}</p>}
          {  formData.designation && <p className="text-gray-700">Designation: {formData.designation}</p>}
         
          </div>
          
          {/* Edit Profile Button */}
          <button 
            onClick={() => setIsEditModalOpen(true)}

            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>

          <Link href={'/profile/editProfilePic'} >
          <button 
            className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Edit Pic
          </button>
          </Link>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className=" rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                {/* <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                /> */}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="bio">
                  Bio
                </label>
                <input
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Age
                </label>
                <input
                  type="date"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Location
                </label>
                <input
                  type="location"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

             

             
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Blogs Section */}
      <div className="mb-8">
       <DeletAllBlogs deleteShow={deleteShow} deletAllBlogs={deletAllBlogs} setDeletShow={setDeletShow}  />
        
        {/* Blog List */}
        <div className="space-y-4">

      {
        isBlogLoading && <p>Loading....</p>
      }

<div className="space-y-4">
  {blogList?.length > 0 ? (
    <div className='overflow-y-auto p-5  h-[500px] '>
      {blogList.map((blog, i) => (
       
        <div key={i} className="border p-4 mt-4 rounded-lg hover:shadow-md transition">

<Link href={`/blog/${blog._id}`}  className="relative block">
          <h3 className="font-semibold text-lg">{blog.title || 'Blog Post Title'}</h3>
          <p className="text-gray-600 text-sm mb-2">
            Published on: {showData(blog.createdAt)}
          </p>
          <p className="text-gray-700">{blog.description}</p>

        </Link>

          <div className="flex gap-2 mt-3">
            <Link href={`/blog/edit/${blog._id}`}>
              <button className="text-sm text-blue-500 hover:underline">Edit</button>
            </Link>
            <button 
              disabled={isDeleting}
              onClick={() => handleBlogDelete(blog.image?.id)} 
              className={`text-sm ${isDeleting ? 'text-gray-500' : 'text-red-500'} hover:underline`}
            >
              {isDeleting ? "Deleting..." : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div>
      <h1>No blogs!</h1>
      <Link href="/create-blog">
        <button className="text-sm text-blue-500 hover:underline">Create</button>
      </Link>
    </div>
  )}
</div>
</div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-red-200 pt-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700 mb-4">These actions are irreversible. Please proceed with caution.</p>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
            Delete Your Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
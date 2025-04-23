import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default async function UserDetailPage({ params }) {
  const { id } = await params; // No need for await, params is not a Promise

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_URL}/api/userDetailPublic/${id}`, {
    next: { revalidate: 60 },
  });

  const userBlogs = await fetch(`${process.env.NEXT_PUBLIC_HOSTED_URL}/api/userBlogsListPublic/${id}`, {
    next: { revalidate: 60 },
  });




  

  if (!res.ok || !userBlogs.ok) return <p className="text-center text-red-500 mt-10">Failed to load user data.</p>;

  const { userDetail } = await res.json();
  const { userBlogList } = await userBlogs.json();


  const age = moment(userDetail?.age).format("YYYY-MM-DD"); // Adjust format as needed


  return (
    <div className="max-w-[1000px] mx-auto  p-6 h-[calc(100vdh-8rem)] rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-white text-center mb-4">
        <span className="special-word">U</span>ser <span className="special-word">P</span>rofile
      </h1>

      {/* User Info */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-[100px] h-[100px] rounded-full bg-gray-300 flex items-center justify-center">
          {userDetail.avatar ? (
            <Image src={userDetail.avatar} alt="profile" width={100} height={100} className="rounded-full" />
          ) : (
            <span className="text-4xl">👤</span>
          )}
        </div>

        {/* User Name & Designation */}
        <div>
          <h2 className="text-xl font-semibold">{userDetail.name}</h2>
          <p className="text-gray-500">{userDetail.designation}</p>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p>
          <span className="font-semibold">📧 Email:</span> {userDetail.email}
        </p>
        <p>
          <span className="font-semibold">📍 Location:</span> {userDetail.location}
        </p>
        <p>
           <span className="font-semibold">🎂 Dob :</span> {age} 
        </p>
        <p>
          <span className="font-semibold">📝 About:</span> {userDetail.about}
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        🕒 Profile created on {new Date(userDetail.createdAt).toLocaleDateString()}
      </p>

      {/* User Posts - Instagram Style */}
      <h2 className="text-xl font-semibold text-white mt-6  mb-4"><span className=" special-word " >P</span>osts</h2>
<div className="flex justify-center">
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-fit mx-auto  p-4 rounded-lg">
    {userBlogList.map((post) => (
      <Link href={`/blog/${post._id}`} key={post._id} className="relative block">
        <Image
          src={post.image.url}
          alt={post.title}
          width={300}
          height={300}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <p className="text-center text-white mt-1 text-sm">{post.title}</p>
      </Link>
    ))}
  </div>
</div>
    </div>
  );
}

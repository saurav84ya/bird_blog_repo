/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com",
        },
      ],
      domains: ["lh3.googleusercontent.com" , "res.cloudinary.com","www.flaticon.com"],
    },
  };
export default nextConfig;

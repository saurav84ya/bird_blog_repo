/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com",
        },
      ],
      domains: ["lh3.googleusercontent.com"],
    },
  };
export default nextConfig;

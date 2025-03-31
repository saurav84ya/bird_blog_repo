import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./AuthProvider";

import { Roboto } from "next/font/google";
import LoaderGlobal from "@/components/LoaderGlobal";

// Initialize the font
const roboto = Roboto({
  subsets: ["latin"], // Supports Latin characters
  weight: ["400", "700"], // Choose weights (400 = Regular, 700 = Bold)
  style: ["normal", "italic"], // Choose styles
  variable: "--font-roboto", // (Optional) Custom CSS variable for Tailwind or global styles
});


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body
       className={roboto.className}
      >
        
       <AuthProvider>
        <LoaderGlobal/>
       <Navbar/>
        {children}
        <Footer/>
        <Toaster />
       </AuthProvider>
      </body>
    </html>
  );
}

"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { IoMdCloseCircle } from "react-icons/io";
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const [dropDown, setDropDown] = useState(false);
    const pathname = usePathname();

    // console.log("session",session)

    return (
        <div className='container py-3 h-16 flex items-center mx-auto w-full lg:w-[1000px] justify-between'>
            {/* Logo */}
            <Link href={'/'}>
                <h2 className="text-2xl font-bold">
                    Light<span className='special-word'>Code</span>.
                </h2>
            </Link>

            {/* Navigation Menu */}
            <ul className='flex items-center gap-6 relative'>
                <li>
                    <Link 
                        href={'/blog'} 
                        className={`capitalize hover:special-word transition-all ${pathname === '/blog' ? 'special-word font-bold' : ''}`}
                    >
                        Blog
                    </Link>
                </li>

                {isAuthenticated ? (
                    <>
                        <li>
                            <Link 
                                href={'/create-blog'} 
                                className={`capitalize hover:special-word transition-all ${pathname === '/create-blog' ? 'special-word font-bold' : ''}`}
                            >
                                Create
                            </Link>
                        </li>

                        {/* Profile Dropdown */}
                        <li className='relative'>
                        <div 
    onClick={() => setDropDown(!dropDown)} 
    className='cursor-pointer flex items-center gap-2'
>
    {session?.user?.image ? (
        <Image
            src={session.user.image} 
            alt='profile'
            width={40}
            height={40}
            className='rounded-full w-10 h-10'
        />
    ) : (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-xl font-bold special-word ">
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
    )}
</div>


                            {/* Dropdown Menu */}
                            {dropDown && (
                                <ul className='absolute top-12 right-0 bg-white shadow-lg rounded-lg py-2 px-4 w-40'>
                                    <li className='flex justify-between items-center border-b pb-2'>
                                        <Link href={'/profile'} className='text-gray-800 font-medium hover:font-bold'>Profile</Link>
                                        <button onClick={() => setDropDown(false)} className="text-red-500">
                                            <IoMdCloseCircle size={20} />
                                        </button>
                                    </li>
                                    <li 
                                        className='mt-2 text-red-500 cursor-pointer hover:text-red-700 transition-all' 
                                        onClick={() => signOut()}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            )}
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link 
                                href={'/login'} 
                                className={`capitalize hover:special-word transition-all ${pathname === '/login' ? 'special-word font-bold' : ''}`}
                            >
                                Log In
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href={'/signup'} 
                                className={`capitalize hover:special-word transition-all ${pathname === '/signup' ? 'special-word font-bold' : ''}`}
                            >
                                Sign Up
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

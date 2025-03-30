"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IoMdCloseCircle } from "react-icons/io";
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useLoadingStore } from '@/store/loadingStore';

export default function Navbar() {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const [dropDown, setDropDown] = useState(false);
    const pathname = usePathname();

    const setLoading = useLoadingStore((state) => state.setLoading);
    // console.log("session",setLoading)

    
    function runLoader () {
        setLoading(true);
        return null;
    }

    useEffect(() => {
        setLoading(false)
    } , [pathname])

    return (
        <div className='container py-3 h-16 flex items-center mx-auto w-full lg:w-[1000px] justify-between'>
            {/* Logo */}
            <Link href={'/'}>
                
                <h2 className="text-2xl font-bold"  onClick={runLoader} >
                Feather<span className='special-word'>Verse</span>.
                </h2>
            </Link>

            {/* Navigation Menu */}
            <ul className='flex items-center gap-6 relative'>
            <li>
                    <span onClick={runLoader} >
                    <Link 
                        href={'/about-us'} 
                        className={`capitalize hover:special-word transition-all ${pathname === '/about-us' ? 'special-word font-bold' : ''}`}
                    >
                        AboutUs
                    </Link>
                    </span>
                </li>
                <li>
                    <span onClick={runLoader} >
                    <Link 
                        href={'/blog'} 
                        className={`capitalize hover:special-word transition-all ${pathname === '/blog' ? 'special-word font-bold' : ''}`}
                    >
                        Blog
                    </Link>
                    </span>
                </li>

                {isAuthenticated ? (
                    <>
                        <li>
                        <span onClick={runLoader} >
                            <Link 
                                href={'/create-blog'} 
                                className={`capitalize hover:special-word transition-all ${pathname === '/create-blog' ? 'special-word font-bold' : ''}`}
                            >
                                Create
                            </Link>
                            </span>
                        </li>

                        {/* Profile Dropdown */}
                        <li className='relative'>
                        <div 
    onClick={() => setDropDown(!dropDown)} 
    className='cursor-pointer flex items-center gap-2'
>
    {session?.user?.image ? (
        <Image
            src={session?.user?.image} 
            alt='profile'
            width={40}
            className='rounded-full  aspect-square'
            height={40}
            
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
                                        <Link href={'/profile'} onClick={ ()=> setDropDown(false)}  className='text-gray-800 font-medium hover:font-bold'>Profile</Link>
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
                        <span onClick={runLoader} >
                            <Link 
                                href={'/login'} 
                                className={`capitalize hover:special-word transition-all ${pathname === '/login' ? 'special-word font-bold' : ''}`}
                            >
                                Log In
                            </Link>
                            </span>
                        </li>
                       
                    </>
                )}
            </ul>
        </div>
    );
}

import LoginForm from '@/components/LoginForm'
import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function page() {

  const session = await getServerSession(authOptions)
  
    // console.log("session",session)
  
    if(session) redirect ("/")

  return (
    <div className='h-[calc(100dvh-8rem)] flex items-center justify-center' >
      <LoginForm/>
    </div>
  )
}

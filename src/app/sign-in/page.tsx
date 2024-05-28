'use client'
import React from "react";
import {auth} from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import Image from "next/image";


export default function SignIn() {
  const router = useRouter();

  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
          <div className="bg-blue-100 text-blue-700 p-4 rounded shadow-md">
              <h1>Loading...</h1>
          </div>
      </main>
    );
  }
  if (user) {
    router.push("/portfolio-list");
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{backgroundImage: "url('/cover.png')"}}>
    <div className="z-10 w-2/3 bg-white p-8 h-screen flex justify-center items-start">
      <div className="flex flex-col justify-center items-center w-full">
        <Image src="/Logo.jpg" alt="" width={200} height={50} />
        <h1 className="font-semibold text-5xl mt-20 mb-12">Sign in</h1>
        <button 
          onClick={() => signInWithGoogle()} 
          className="bg-white hover:bg-gray-300 text-gray font-bold py-3 px-12 rounded-full border border-black p-3 flex items-center">
          <div className='flex flex-row items-center'>
            <Image src="/google-icon.png" alt="" width={18} height={18} className="mr-2" />
            <span>Continue with Google</span>
          </div>
        </button>
        <div className='flex flex-row justify-center items-center mt-24 text-center'>
          <p className='w-2/3 flex justify-center text-base'>By creating an account you agree with our Terms of Service, Privacy Policy, and our default Notification Settings.</p>
        </div>
      </div>
    </div>
  </div>
  );
}
'use client';
import React from 'react';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/firebaseConfig';
import Image from 'next/image';

export default function SignOut() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <p className="font-semibold text-5xl mt-20 mb-12">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/cover.png')" }}>
      <div className="z-10 w-2/3 bg-white p-8 h-screen flex justify-center items-start">
        <div className="flex flex-col justify-center items-center w-full">
          <Image src="/Logo.jpg" alt="Logo" width={200} height={50} />
          <h1 className="font-semibold text-5xl mt-20 mb-12">Hi, {user?.displayName || user?.email}</h1>
          <button 
            onClick={handleSignOut} 
            className="bg-white hover:bg-gray-300 text-gray font-bold py-3 px-12 rounded-full border border-black p-3 flex items-center">
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

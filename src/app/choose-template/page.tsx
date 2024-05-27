"use client";
import Link from "next/link";
import React, {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

export default function ChooseTemplateForm() {
  const [template, setTemplate] = useState<string>("");
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center min-h-screen" style={{backgroundImage: "url('/choose-template-background.jpeg')", backgroundSize: "cover"}}>
      <header>
        <nav className="text-gray-400 p-4 fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center pr-6">
            <div className="flex items-center">
              <Image src="/LogoCut.png" alt="Logo" width={160} height={60} onClick={() => router.push("/")} className="hover:cursor-pointer"/>
            </div>
          </div>
        </nav>
      </header>
      <div className="flex min-w-screen justify-center text-3xl font-bold">
        <h1>How would you like to get started?</h1>
      </div>
      <div className="flex flex-row max-w-screen justify-center space-x-32 items-center min-h-96">
        <div className="flex flex-col">
          <img src="/card 2.png" alt="First Template" onClick={() => setTemplate("first")}
               className={`${template == "first" ? "opacity-100" : "opacity-60"} hover:opacity-100 hover:cursor-pointer`}
               width={template == "first" ? 260 : 240}/>
        </div>
        <div className="flex flex-col">
          <img src="/card 3.png" alt="Second Template" onClick={() => setTemplate("second")}
               className={`${template == "second" ? "opacity-100" : "opacity-60"} hover:opacity-100 hover:cursor-pointer`}
               width={template == "second" ? 260 : 240}/>
        </div>
      </div>
      <div className="flex min-w-screen justify-center">
        {template == "" ? <></> :
        <Link href={`${template}-template-form`} className="hover:bg-orange-100 text-black font-semibold py-2 px-6 rounded-full flex items-center border-2 border-black">
          Create portfolio
        </Link>}
      </div>
    </div>
  );
}
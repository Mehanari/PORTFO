'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EmblaCarousel from './components/EmblaCarousel';
import { OPTIONS, SLIDES } from './index';

function sendToSignUp(router: ReturnType<typeof useRouter>) {
  router.push('/signUp');
}

//TO DO pushing to the signIn page

// function sendToSignIn(router: ReturnType<typeof useRouter>) {
//   router.push('/signIn');
// }

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col bg-orange-200 justify-center min-h-screen">
      <header>
        <nav className="text-gray-400 p-4 shadow-md fixed w-full top-0 bg-white z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center pr-6">
            <div className="flex items-center">
              <Image src="/LogoCut.png" alt="Logo" width={160} height={60} />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => sendToSignUp(router)}
                className="flex items-center font-semibold"
              >
                Sign Up
              </button>
              <button
                // onClick={() => sendToSignIn(router)}
                className="flex items-center font-semibold"
              >
                Sign In
              </button>
              <button className="bg-orange-400 hover:bg-orange-300 text-white font-semibold py-2 px-6 rounded-full flex items-center shadow-md">
                Create Portfolio
              </button>
            </div>
          </div>
        </nav>
      </header>
      <section className="flex flex-col lg:flex-row shadow-md pt-28 pb-10" style={{ zIndex: 10 }}>
        <div className="lg:w-1/3 flex justify-center items-center pl-14 pr-10">
          <div>
            <h1 className="text-black font-bold text-4xl mb-4 lg:text-4xl">
              SHOW YOUR SKILLS WITH ONLINE PORTFOLIO
            </h1>
            <p className="text-gray-700 lg:text-base">
              Discover the benefits of creating, customizing, and enhancing an online portfolio for work opportunities.
            </p>
            <button className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full flex items-center shadow-md mt-4">
              Create Portfolio
            </button>
          </div>
        </div>
        <div className="lg:w-2/3 pr-14 pl-14">
          <Image src="/LaptopFirst.png" alt="Laptop" width={2000} height={1000} layout="responsive"/>
        </div>
      </section>
      <section className="flex flex-col lg:flex-row bg-white pt-20 justify-center items-center">
        <div className="flex flex-col lg:w-1/2 pr-14 pl-14">
          <h1 className="text-black font-bold text-4xl mb-4 lg:text-6xl">EXPLORE OUR TEMPLATES</h1>
        </div>
        <div className="flex flex-col lg:w-1/3 pr-14 pl-14">
          <h1 className="text-black font-medium text-2xl mb-4">
            Use one of the templates or create your own portfolio.
          </h1>
          <div className="flex flex-row items-start">
            <span>
              <a href="#" className="font-bold text-1xl text-black underline hover:text-gray-600">
                Read more
              </a>
            </span>
            <Image src="/arrow.png" alt="Arrow" width={10} height={10} className="m-2" />
          </div>
        </div>
      </section>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      <section className="flex flex-col lg:flex-row bg-white pb-20 justify-center items-center">
        <div className="flex flex-col lg:flex-col w-1/2 justify-center items-center">
          <h1 className="flex text-black font-bold text-4xl lg:text-5xl" style={{ marginLeft: '150px' }}>
            CREATING YOUR OWN PORTFOLIO
          </h1>
        </div>
        <div className="flex flex-col lg:flex-col bg-white w-1/2 justify-end">
          <div className="flex flex-row lg:flex-row">
            <div className="flex flex-col lg:flex-col w-1/3 justify-center items-center">
              <div className="circle text-white font-bold text-1xl lg:text-2xl" style={{ background: '#FFA500' }}>
                1
              </div>
              <div className="circle_small" style={{ background: '#D3D3D3' }}></div>
              <div className="circle_small" style={{ background: '#D3D3D3' }}></div>
              <div className="circle_small" style={{ background: '#D3D3D3' }}></div>
            </div>
            <div className="flex w-2/3 m-4 justify-start">
              <p className="text-black font-bold text-1xl lg:text-2xl mt-2">Choose the template</p>
            </div>
          </div>
          <div className="flex flex-row lg:flex-row">
            <div className="flex flex-col lg:flex-col w-1/3 justify-center items-center">
              <div className="circle text-white font-bold text-1xl lg:text-2xl" style={{ background: '#FF8C00' }}>
                2
              </div>
              <div className="circle_small" style={{ background: '#D3D3D3' }}></div>
              <div className="circle_small" style={{ background: '#D3D3D3' }}></div>
              <div className="circle_small" style={{ background: '#D3D3D3' }}></div>
            </div>
            <div className="flex w-2/3 m-4 justify-start">
              <p className="text-black font-bold text-1xl lg:text-2xl mt-2">Customize</p>
            </div>
          </div>
          <div className="flex flex-row lg:flex-row">
            <div className="flex flex-col lg:flex-col w-1/3 justify-center items-center">
              <div className="circle text-white font-bold text-1xl lg:text-2xl" style={{ background: '#FF6347' }}>
                3
              </div>
            </div>
            <div className="flex w-2/3 m-4 justify-start">
              <p className="text-black font-bold text-1xl lg:text-2xl mt-2">Enjoy your portfolio</p>
            </div>
          </div>
        </div>
      </section>
      <section
        className="flex flex-col bg-white shadow-lg w-full h-screen"
        style={{
          backgroundImage: "url('/MacBook.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: 10,
        }}
      >
        <div className="flex flex-col w-1/3 justify-start items-end p-4 ml-auto lg:flex-row">
          <div className="text-left w-full" style={{ paddingTop: '20px', paddingLeft: '25px' }}>
            <h1 className="text-black font-bold text-3xl mb-4 lg:text-6xl">WHY WE?</h1>
            <p className="text-black font-medium text-sm mb-4 lg:text-xl mt-8 mb-4">
              <span className="font-bold">01. </span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p className="text-black font-medium text-sm mb-4 lg:text-xl mt-4 mb-4">
              <span className="font-bold">02. </span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p className="text-black font-medium text-sm mb-4 lg:text-xl mt-4 mb-8">
              <span className="font-bold">03. </span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <button className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 lg:px-10 text-sm rounded-full flex shadow-md mt-4 lg:text-lg">
              Start Creating
            </button>
          </div>
        </div>
      </section>
      <section className="flex flex-col bg-white pt-20 justify-center items-center shadow-md" style={{ zIndex: 10 }}>
        <h2 className="text-black font-bold text-3xl mb-4 lg:text-5xl">FAQs</h2>
        <div className="flex flex-row mt-10 mb-20">
          <div className="flex flex-col lg:w-1/3 pr-14 pl-14">
            <p className="text-black font-medium text-1xl mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </p>
            <div className="flex flex-row items-start">
              <span>
                <a href="#" className="font-bold text-1xl text-black underline hover:text-gray-600">
                  Get answer
                </a>
              </span>
              <Image src="/arrow.png" alt="Arrow" width={10} height={10} className="m-2" />
            </div>
          </div>
          <div className="flex flex-col lg:w-1/3 pr-14 pl-14">
            <p className="text-black font-medium text-1xl mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </p>
            <div className="flex flex-row items-start">
              <span>
                <a href="#" className="font-bold text-1xl text-black underline hover:text-gray-600">
                  Get answer
                </a>
              </span>
              <Image src="/arrow.png" alt="Arrow" width={10} height={10} className="m-2" />
            </div>
          </div>
          <div className="flex flex-col lg:w-1/3 pr-14 pl-14">
            <p className="text-black font-medium text-1xl mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit?
            </p>
            <div className="flex flex-row items-start">
              <span>
                <a href="#" className="font-bold text-1xl text-black underline hover:text-gray-600">
                  Get answer
                </a>
              </span>
              <Image src="/arrow.png" alt="Arrow" width={10} height={10} className="m-2" />
            </div>
          </div>
        </div>
      </section>
      <footer className="p-10" style={{ backgroundImage: "url('/footer.png')" }}></footer>
    </div>
  );
}

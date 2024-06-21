'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import EmblaCarousel from './components/EmblaCarousel';
import {OPTIONS, SLIDES} from './index';
import {auth} from "@/firebase/firebaseConfig";
import {useAuthState} from 'react-firebase-hooks/auth';
import {getAllPortfoliosAsSearchItems, userHasPortfolios} from "@/functions/databaseAccess";
import Pagination from '@/app/components/Pagination';
import {PortfolioSearchItem} from "@/model/commonTypes";
import {TemplateType} from "@/templatesTypes";
import "@/app/globals.css";

function startsWithIgnoreCase(str: string, prefix: string): boolean {
    return str.toLowerCase().startsWith(prefix.toLowerCase());
}

function portfolioHasProjectInTimeframe(portfolio: PortfolioSearchItem, fromDate: string, toDate: string): boolean {
    if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return portfolio.projectsCreationDates.some((date) => date >= from && date <= to);
    } else if (fromDate) {
        const from = new Date(fromDate);
        return portfolio.projectsCreationDates.some((date) => date >= from);
    } else if (toDate) {
        const to = new Date(toDate);
        return portfolio.projectsCreationDates.some((date) => date <= to);
    }
    return true;
}

export default function Home() {
  const [user, loading] = useAuthState(auth);
  //Search form values
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
  const [existingRoles, setExistingRoles] = useState<string[]>([]);
  const [existingRoleFiltered, setExistingRoleFiltered] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();

  let [portfolios, setPortfolios] = useState<PortfolioSearchItem[] | null>(null);
  const [portfoliosToShow, setPortfoliosToShow] = useState<PortfolioSearchItem[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  let indexOfLastItem;
  let indexOfFirstItem;
  let currentItems: PortfolioSearchItem[] = [];

  if (portfoliosToShow) {
    indexOfLastItem = currentPage * itemsPerPage;
    indexOfFirstItem = indexOfLastItem - itemsPerPage;
    currentItems = portfoliosToShow.slice(indexOfFirstItem, indexOfLastItem);
  }

  useEffect(() => {
    getAllPortfoliosAsSearchItems().then((data) => {
      setPortfolios(data);
      setPortfoliosToShow(data);
      let roles: string[] = [];
      if (data){
        data.forEach((portfolio) => {
          if (portfolio.role) {
            roles.push(portfolio.role);
          }
        });
      }
      setExistingRoles(roles);
    });
  }, []);

  useEffect(() => {
    if (portfolios) {
      let filteredPortfolios = portfolios;
      if (name != '') {
        filteredPortfolios = filteredPortfolios.filter((portfolio) => startsWithIgnoreCase(portfolio.fullname, name));
      }
      if (role != '') {
        filteredPortfolios = filteredPortfolios.filter((portfolio) => startsWithIgnoreCase(portfolio.role, role));
      }
      if (fromDate != '' || toDate != '') {
          filteredPortfolios = filteredPortfolios.filter((portfolio) => portfolioHasProjectInTimeframe(portfolio, fromDate, toDate));
      }
      setPortfoliosToShow(filteredPortfolios);
    }
  }, [portfolios, name, role, fromDate, toDate]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  const handleCreatePortfolioClick = async () => {
    if (user){
      if (await userHasPortfolios(user.uid)){
        router.push('/portfolio-list');
      }
      else{
        router.push('/choose-template');
      }
    }
    else{
        router.push('/sign-in');
    }
  }

  const handleStartCreatingClick = () => {
    if (user){
      router.push('/choose-template');
    }
    else{
      router.push('/sign-in');
    }
  }

  const handleRoleInputChange = (value: string) => {
    setRole(value);
    filterRolesSuggestions(value);
  };

  const handleRoleInputFocus = () => {
    filterRolesSuggestions(role);
    setShowSuggestions(true);
  }

  const filterRolesSuggestions = (value: string) => {
    if (value) {
      const filtered = existingRoles.filter((role) =>
          role.toLowerCase().startsWith(value.toLowerCase())
      );
      setExistingRoleFiltered(filtered);
    } else {
      setExistingRoleFiltered(existingRoles);
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setRole(suggestion);
    setExistingRoleFiltered([]);
    setShowSuggestions(false);
  };
  const clearInput = () => {
    setName('');
  };

  const clearAllFields = () => {
    setName('');
    setRole('');
    setFromDate('');
    setToDate('');
    setShowSuggestions(false);
  };

  const handlePortfolioClick = (item: PortfolioSearchItem) => {
    router.push(`${item.link}`);
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen">
          <div className="bg-blue-100 text-blue-700 p-4 rounded shadow-md">
              <h1>Loading...</h1>
          </div>
      </main>
    );
  }
  return (
    <div className="flex flex-col bg-orange-200 justify-center min-h-screen">
      <header>
        <nav className="text-gray-400 p-4 shadow-md fixed w-full top-0 bg-white z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center pr-6">
            <div className="flex items-center">
              <Image src="/LogoCut.png" alt="Logo" width={160} height={60} />
            </div>
            <div className="flex space-x-4">
              {user ? (
                <div className='flex flex-row space-x-4'>
                  <span className="flex items-center font-semibold">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={() => router.push('/sign-out')}
                    className="flex items-center font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push('/sign-in')}
                  className="flex items-center font-semibold"
                >
                  Sign In
                </button>
              )}
              <button onClick={handleCreatePortfolioClick} className="bg-orange-400 hover:bg-orange-300 text-white font-semibold py-2 px-6 rounded-full flex items-center shadow-md">
                Create Portfolio
              </button> {/*TODO Send to the page with available portfolios templates*/} 
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
            <button onClick={handleCreatePortfolioClick} className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full flex items-center shadow-md mt-4">
              Create Portfolio
            </button> {/*TODO Send to the page with available portfolios templates*/} 
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
          </div> {/*TODO Send to the page with available portfolios templates*/} 
        </div>
      </section>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      {portfoliosToShow ?
          <section className="flex flex-col lg:flex-col bg-white pb-20 justify-center items-center">
            <h1 className="flex text-black font-bold text-4xl lg:text-5xl mb-10">Explore other portfolios</h1>
            <div className="flex justify-center items-end mt-4 space-x-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2"></label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    placeholder="Name"
                    className="shadow placeholder-black appearance-none border border-orange-500 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2 pr-10"
                    onChange={({ target }) => setName(target.value)}
                  />
                  {name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center mb-2">
                      <svg
                        className="h-5 w-5 text-gray-500 cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={clearInput}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    placeholder="Name"
                    className="shadow placeholder-black appearance-none border border-orange-500 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    onChange={({target}) => setName(target.value)}
                /> */}
              </div>
              <div className="relative">
                <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2"></label>
                <input
                    type="text"
                    id="role"
                    name="role"
                    value={role}
                    placeholder="Role"
                    onChange={({target}) => handleRoleInputChange(target.value)}
                    onFocus={handleRoleInputFocus}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    className="shadow placeholder-black appearance-none border border-orange-500 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                {showSuggestions && existingRoleFiltered.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto">
                      {existingRoleFiltered.map((suggestion, index) => (
                          <li
                              key={index}
                              onMouseDown={() => handleSuggestionClick(suggestion)}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                          >
                            {suggestion}
                          </li>
                      ))}
                    </ul>
                )}
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-col justify-end">
                  <div className="flex justify-center items-center">
                    <h1 className="font-extrabold text-black text-xl m-3">Project Datepicker</h1>
                  </div>
                  <div className="flex flex-row">
                    <div className="m-2">
                      <label htmlFor="fromDate" className="block text-black font-bold text-sm mb-2">From</label>
                      <input
                          type="date"
                          id="fromDate"
                          name="fromDate"
                          value={fromDate}
                          onChange={({target}) => setFromDate(target.value)}
                          className="shadow appearance-none border border-orange-500 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="m-2">
                      <label htmlFor="toDate" className="block text-black font-bold text-sm mb-2">To</label>
                      <input
                          type="date"
                          id="toDate"
                          name="toDate"
                          value={toDate}
                          onChange={({target}) => setToDate(target.value)}
                          className="shadow appearance-none border border-orange-500 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={clearAllFields}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline mb-2"
              >
                Clear All
              </button>
            </div>
            <div className='flex flex-col justify-center'>
              <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mt-14 mb-14">
                {currentItems.map((portfolio, index) => (
                    <div key={index}
                          onClick={() => handlePortfolioClick(portfolio)}
                          className="flex flex-col items-center bg-white border-2 border-gray-200 rounded-3xl p-10 shadow cursor-pointer">
                      <img src={portfolio.photo} alt={portfolio.fullname} className="circle-portfolio object-cover"/>
                      <h2 className="mt-4 text-xl font-semibold">{portfolio.fullname}</h2>
                      <p className="text-gray-700">{portfolio.role}</p>
                    </div>
                ))}
              </div>
              <Pagination
                  itemsPerPage={itemsPerPage}
                  totalItems={portfoliosToShow.length}
                  currentPage={currentPage}
                  paginate={paginate}
              />
            </div>
          </section> : <></>
      }
      <section className="flex flex-col lg:flex-row bg-white pb-20 justify-center items-center">
        <div className="flex flex-col lg:flex-col w-1/2 justify-center items-center">
          <h1 className="flex text-black font-bold text-4xl lg:text-5xl" style={{marginLeft: '150px'}}>
            CREATING YOUR OWN PORTFOLIO
          </h1>
        </div>
        <div className="flex flex-col lg:flex-col bg-white w-1/2 justify-end">
          <div className="flex flex-row lg:flex-row">
            <div className="flex flex-col lg:flex-col w-1/3 justify-center items-center">
              <div className="circle-page text-white font-bold text-1xl lg:text-2xl" style={{background: '#FFA500'}}>
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
              <div className="circle-page text-white font-bold text-1xl lg:text-2xl" style={{ background: '#FF8C00' }}>
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
              <div className="circle-page text-white font-bold text-1xl lg:text-2xl" style={{ background: '#FF6347' }}>
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
            <h1 className="text-black font-bold text-3xl mb-4 lg:text-6xl">WHY US?</h1>
            <p className="text-black font-medium text-sm mb-4 lg:text-xl mt-8 mb-4">
              <span className="font-bold">01. </span>
              User-Friendly Interface and Customization Options
            </p>
            <p className="text-black font-medium text-sm mb-4 lg:text-xl mt-4 mb-4">
              <span className="font-bold">02. </span>
              Versatile Media Integration and Compatibility
            </p>
            <p className="text-black font-medium text-sm mb-4 lg:text-xl mt-4 mb-8">
              <span className="font-bold">03. </span>
              Continuous Innovation and Support
            </p>
            <button onClick={handleStartCreatingClick} className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 lg:px-10 text-sm rounded-full flex shadow-md mt-4 lg:text-lg">
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
              How to register my account on PORTFO?
            </p>
            <div className="flex flex-row items-start">
              <span>
                <a href="#" className="font-bold text-1xl text-black underline hover:text-gray-600">
                  Get answer
                </a> {/*TODO Send to the details of the company*/} 
              </span>
              <Image src="/arrow.png" alt="Arrow" width={10} height={10} className="m-2" />
            </div>
          </div>
          <div className="flex flex-col lg:w-1/3 pr-14 pl-14">
            <p className="text-black font-medium text-1xl mb-4">
              Is it possible to restore my previous portfolios?
            </p>
            <div className="flex flex-row items-start">
              <span>
                <a href="#" className="font-bold text-1xl text-black underline hover:text-gray-600">
                  Get answer
                </a> {/*TODO Send to the details of the company*/} 
              </span>
              <Image src="/arrow.png" alt="Arrow" width={10} height={10} className="m-2" />
            </div>
          </div>
          <div className="flex flex-col lg:w-1/3 pr-14 pl-14">
            <p className="text-black font-medium text-1xl mb-4">
              How to get Pro account?
            </p>
            <div className="flex flex-row items-start">
              <span>
                <a href="#" className="font-bold text-1xl text-black underline hover:text-gray-600">
                  Get answer
                </a> {/*TODO Send to the details of the company*/} 
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

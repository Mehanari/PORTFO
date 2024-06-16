"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { fetchPortfoliosAsListItems, deletePortfolio, editPortfolioName } from '@/functions/databaseAccess';
import PortfolioDeletePopUp from '../components/PortfolioDeletePopUp';
import Image from "next/image";

interface Portfolio {
  id: string;
  name: string;
  imageUrl: string;
  status: string;
  link: string;
  templateType: number;
}

const Header = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <div className="header flex justify-between items-center ml-16 mr-16 p-4 sm:p-14 border-b-2 border-orange-400">
      <div className="cursor-pointer" onClick={handleHomeClick}>
        <Image src="/LogoCut.png" alt="Logo" width={160} height={60}/>
      </div>
      <div className="text-3xl sm:text-5xl font-bold">My portfolios</div>
    </div>
  );
};

const Footer = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleNewPageClick = () => {
    router.push('/choose-template');
  };

  return (
    <div className="footer flex justify-between w-full items-center">
      <div className="flex flex-row w-2/3 items-center lg:p-12 md:p-6 sm:p-4">
        <button onClick={handleHomeClick} className="flex w-1/2 justify-center text-lg font-medium  px-4 py-2 rounded">
          <Image src="/back_button.png" alt="Logo" width={40} height={40}/>
        </button>
        <button onClick={handleNewPageClick} className="flex w-1/2 justify-center text-lg font-mediumpx-4 py-2 rounded">
          <Image src="/add_button_portfolio.png" alt="Logo" width={60} height={60}/>
        </button>
      </div>
      <div className='decoration flex justify-end w-1/3'>
        <Image src="/decor_list.png" alt="Logo" width={160} height={160}/>
      </div>
    </div>
  );
};

const getStatusColorClass = (status : string) => {
  switch (status) {
    case 'Published':
      return 'bg-green-200'; 
    case 'Draft':
      return 'bg-gray-200'; 
    case 'Pending changes':
      return 'bg-orange-200'; 
    default:
      return 'bg-white'; 
  }
};


const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is authenticated: ", user);
        try {
          const portfolioData = await fetchPortfoliosAsListItems(user.uid);
          setPortfolios(portfolioData);
        } catch (error) {
          console.error("Error fetching portfolios: ", error);
        }
      } else {
        console.log("No user is authenticated.");
        router.push('/sign-in');
      }
      setLoading(false); // Set loading to false after handling auth state change
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Or some other loading indicator
  }

  const handleNameClick = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const handleEditClick = (portfolio: Portfolio) => {
    let editPageName = '';

    
    switch (portfolio.templateType) {
      case 0:
        editPageName = 'first-template-form';
        break;
      case 1:
        editPageName = 'second-template-form';
        break;
      default:
        console.log('Portfolio with following Id not found');
    }

    const editPageUrl = `/${editPageName}/${portfolio.id}`;
    router.push(editPageUrl);
  };

  const handleBlur = async () => {
    if (editingId) {
      try {

        await editPortfolioName(editingName, editingId);

        setPortfolios((prevPortfolios) =>
          prevPortfolios.map((portfolio) =>
            portfolio.id === editingId ? { ...portfolio, name: editingName } : portfolio
          )
        );
      } catch (error) {
        console.error('Error updating portfolio: ', error);
      }
    }
    setEditingId(null);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedPortfolioId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPortfolioId) {
      try {
        await deletePortfolio(selectedPortfolioId);

        setPortfolios((prevPortfolios) =>
          prevPortfolios.filter((portfolio) => portfolio.id !== selectedPortfolioId)
        );
      } catch (error) {
        console.error('Error deleting portfolio: ', error);
      }
      setShowModal(false);
      setSelectedPortfolioId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedPortfolioId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex justify-center mt-4 flex-col w-full pl-2 sm:pl-4 pr-2 sm:pr-4">
        <div className="flex justify-center items-center w-full flex-wrap mb-10 lg:text-xl font-bold text-gray-600 mt-10 lg:mt-16 lg:mb-16">
          <div className="flex w-full sm:w-1/2 justify-between items-center">
            <p className="w-1/6 sm:w-1/12 text-center">№</p>
            <p className="w-2/3 sm:w-5/12 text-center">Name of portfolio</p>
            <p className="w-2/3 sm:w-5/12 text-center">Website link</p>
          </div>
          <div className="flex justify-center w-1/3 sm:w-1/3 text-center lg:pr-10 md:pr-1">
            <p className="flex w-1/2 justify-end ">Status</p>
          </div>
        </div>
        <div className="flex justify-center mt-2 sm:mt-4 flex-col w-full">
          {portfolios.map((portfolio, index) => (
            <div key={portfolio.id} className="flex justify-center items-center mb-4 lg:mb-6 mt-4 lg:mt-6">
              <div className="flex w-full sm:w-1/2 justify-between items-center">
                <div className="w-1/6 sm:w-1/12 font-bold lg:text-xl md:text-base text-center text-gray-600">{index + 1}</div>
                {editingId === portfolio.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={handleNameChange}
                    onBlur={handleBlur}
                    autoFocus
                    className="text-base sm:text-lg font-medium w-2/3 sm:w-5/12 p-1 border-2 rounded-full text-gray-600"
                  />
                ) : (
                  <h3
                    className="text-base sm:text-lg font-medium cursor-pointer w-2/3 sm:w-5/12 text-center border-2 rounded-full text-gray-600"
                    onClick={() => handleNameClick(portfolio.id, portfolio.name)}
                  >
                    {portfolio.name}
                  </h3>
                )}
                <p className="w-2/3 sm:w-5/12 text-center">
                  {portfolio.link ? (
                    <a
                      className="px-2 sm:px-4 justify-center text-center text-gray-600 text-sm sm:text-base font-medium underline leading-tight hover:text-orange-500"
                      href={portfolio.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  ) : (
                    <span></span>
                  )}
                </p>
              </div>
              <div className="flex w-1/3 sm:w-1/3 justify-between items-center">
                <div className="flex flex-col sm:flex-row w-1/3 justify-center">
                  <button
                    onClick={() => handleEditClick(portfolio)}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-center text-gray-600 text-sm sm:text-base font-medium underline leading-tight hover:text-orange-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(portfolio.id)}
                    className="px-2 sm:px-4 py-1 sm:py-2 text-center text-gray-600 text-sm sm:text-base font-medium underline leading-tight hover:text-orange-500"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex justify-center text-gray-600 font-bold text-base sm:text-lg w-2/3 sm:w-full text-center ">
                  <p className={`w-1/2 border-2 rounded-full ${getStatusColorClass(portfolio.status)}`}>
                    {portfolio.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
      {showModal && (
        <PortfolioDeletePopUp
          message="Are you sure you want to delete this portfolio?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default PortfolioList;
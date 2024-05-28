"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig.js';
import { fetchPortfolios, deletePortfolio, editPortfolioName } from '@/functions/databaseAccess';
import PortfolioDeletePopUp from '../components/PortfolioDeletePopUp';

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
    <div className="header flex justify-between items-center p-4">
      <div className="text-xl font-bold cursor-pointer" onClick={handleHomeClick}>
        PORTFO
      </div>
    </div>
  );
};

const Footer = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleNewPageClick = () => {
    router.push('/new');
  };

  return (
    <div className="footer flex justify-between items-center p-4 ]mt-4">
      <button onClick={handleHomeClick} className="text-lg font-medium  px-4 py-2 rounded">
        Back
      </button>
      <button onClick={handleNewPageClick} className="text-lg font-mediumpx-4 py-2 rounded">
        New
      </button>
    </div>
  );
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
          const portfolioData = await fetchPortfolios(user.uid);
          setPortfolios(portfolioData);
        } catch (error) {
          console.error("Error fetching portfolios: ", error);
        }
      } else {
        console.log("No user is authenticated.");
        router.push('/signUp');
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

        editPortfolioName(editingName, editingId);

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
        deletePortfolio(selectedPortfolioId);

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex justify-center mt-4 flex-grow">
        <div className="portfolio-list max-w-lg w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="flex flex-col mb-4">
              <div className="portfolio-item p-4 border border-gray-200">
                <div className="portfolio-details flex items-center space-x-4">
                  {editingId === portfolio.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={handleNameChange}
                      onBlur={handleBlur}
                      autoFocus
                      className="text-lg font-medium w-1/4 p-1 border border-gray-300 rounded"
                    />
                  ) : (
                    <h3
                      className="text-lg font-medium cursor-pointer w-1/4"
                      onClick={() => handleNameClick(portfolio.id, portfolio.name)}
                    >
                      {portfolio.name}
                    </h3>
                  )}
                  <p className="text-gray-600 w-1/4">
                    <a href={portfolio.link} className="text-indigo-600 hover:text-indigo-800">
                      {portfolio.link}
                    </a>
                  </p>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditClick(portfolio)} className="px-4 py-2">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(portfolio.id)} className="px-4 py-2">
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-600 w-1/4">{portfolio.status}</p>
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
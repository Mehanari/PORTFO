"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase/firebaseConfig.js';
import { getDocs, collection, doc, updateDoc, query, where } from 'firebase/firestore';
import { getStatusName } from '@/functions/statusNameUtilities';
import { PORTFOLIOS_COLLECTION_NAME } from '@/constants';

interface Portfolio {
  id: string;
  name: string;
  imageUrl: string;
  status: string;
  link: string;
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

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is authenticated: ", user);
        try {
          const snapshot = await getDocs(query(collection(db, PORTFOLIOS_COLLECTION_NAME), where('userId', '==', user.uid)));
          const portfolioData = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            imageUrl: doc.data().photoPath,
            status: getStatusName(doc.data().status),
            link: doc.data().link,
          }));
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

  const handleBlur = async () => {
    if (editingId) {
      try {
        const portfolioRef = doc(db, "portfolios", editingId);
        await updateDoc(portfolioRef, {
          name: editingName
        });

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


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex justify-center mt-4 flex-grow">
        <div className="portfolio-list max-w-lg w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="flex flex-col mb-4">
              <div className="portfolio-item p-4 border border-gray-200">
                <div className="portfolio-image">
                  {/* <img src={portfolio.imageUrl} alt={portfolio.name} className="w-full h-48 object-cover" /> */}
                </div>
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
                    <button className="px-4 py-2">
                      Edit
                    </button>
                    <button className="px-4 py-2">
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
    </div>
  );
};

export default PortfolioList;

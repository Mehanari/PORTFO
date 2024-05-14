"use client"
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig.js'; 
import { CollectionReference, QueryDocumentSnapshot} from '@firebase/firestore-types'; 
import { getDocs, collection } from 'firebase/firestore';

interface Portfolio {
  id: string;
  name: string;
  imageUrl: string;
  status: string;
  link: string;
}

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "portfolios"));
        
        snapshot.docs.forEach((doc) => {
          console.log("Document ID:", doc.id);
          console.log("Document data:", doc.data());
        }); 

        const portfolioData = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            imageUrl: doc.data().photoPath,
            status: "temp",
            link: doc.data().link,
        } ));

        console.log(portfolioData);
        setPortfolios(portfolioData);
      } catch (error) {
        console.error('Error fetching portfolios: ', error);
      }
    };

    fetchPortfolios();
  }, []);

  return (
    <div className="portfolio-list">
      {portfolios.map((portfolio) => (
        <div key={portfolio.id} className="portfolio-item">
          <div className="portfolio-image">
            <img src={portfolio.imageUrl} alt={portfolio.name} />
          </div>
          <div className="portfolio-details">
            <h3>{portfolio.name}</h3>
            <p><a href={portfolio.link}>{portfolio.link}</a></p>
            <p>{portfolio.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioList;
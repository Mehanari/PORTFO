"use client"
import {useState, useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseConfig";
import {PortfolioDataPreview} from "@/model/types";
import {getPortfolioDataForUser} from "@/functions/databaseAccess";


export default function FirstTemplatePreview({ params }: { params: { portfolioId: string } }) {
  const [user, loading, error] = useAuthState(auth);
  const [protfolioData, setPortfolioData] = useState<PortfolioDataPreview | undefined>(undefined);

  useEffect(() => {
    console.log(user)
    if (user) {
      console.log("HELLO")
      getPortfolioDataForUser(params.portfolioId).then((data) => {
        setPortfolioData(data);
      });
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error while loading your account</div>
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

  if (!user) {
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded shadow-md">
          <h1>Not authorized</h1>
        </div>
      </main>
    );
  }

  if (!protfolioData) {
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="bg-blue-100 text-blue-700 p-4 rounded shadow-md">
          <h1>Loading portfolio data...</h1>
        </div>
      </main>
    );
  }

  return (
    <div>
      <img src={protfolioData.photoPath} alt=""/>
      <p>Username:</p>
      <div className="">
        <span>{protfolioData.username}</span>
      </div>
      <p>Full name:</p>
      <div className="">
        <span>{protfolioData.fullName}</span>
      </div>
      <p>Location:</p>
      <div className="">
        <span>{protfolioData.location}</span>
      </div>
      <p>Role:</p>
      <div className="">
        <span>{protfolioData.role}</span>
      </div>
      <p>Bio:</p>
      <div className="">
        <span>{protfolioData.bio}</span>
      </div>
      <p>Links:</p>
      {protfolioData.links.map((row, index) => (
        <div key={index}>
          <a href={row} target="_blank" rel="noreferrer">{row}</a>
        </div>
      ))}
      <p>My works:</p><br/>
      {protfolioData.projects.map((project, index) => (
        <div key={index}>
          <p>Project photo:</p>
          <div
            className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
            <img src={project.photoPath} alt=""/>
          </div>
          <p>Project name:</p>
          <p>{project.name}</p>
          <p>Project link:</p>
          <a href={project.link} target="_blank" rel="noreferrer">{project.link}</a>
        </div>
      ))}
    </div>
  )

}

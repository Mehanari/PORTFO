"use client"
import {useState, useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseConfig";
import {PortfolioDataPreview} from "@/model/firstTemplateTypes";
import {getFirstTemplatePortfolioData} from "@/functions/databaseAccess";
import {useRouter} from "next/navigation";
import { usePDF } from 'react-to-pdf';


export default function FirstTemplatePreview({ params }: { params: { portfolioId: string } }) {
  const [user, loading, error] = useAuthState(auth);
  const [protfolioData, setPortfolioData] = useState<PortfolioDataPreview | undefined>(undefined);
  const router = useRouter();
  const { toPDF, targetRef } = usePDF({filename: `${params.portfolioId}.pdf`});

  useEffect(() => {
    if (user) {
      getFirstTemplatePortfolioData(params.portfolioId).then((data) => {
        setPortfolioData(data);
      });
    }
  }, [params.portfolioId, user]);

  const handleBackToEditor = () => {
    router.push('/first-template-form/' + params.portfolioId);
  }

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
      <main className="flex justify-center items-center h-screen ">
        <div className="bg-blue-100 text-blue-700 p-4 rounded shadow-md">
          <h1>Loading portfolio data...</h1>
        </div>
      </main>
    );
  }

  return (
      <body className="font-cursive" style={{background: "#FFF0F5"}}>
            <div className="flex flex-row pl-20 pr-20">
              <div className="flex items-center w-1/3 h-20 ml-auto">
                <div className="flex flex-row text-2xl">
                  <button onClick={handleBackToEditor}>Back to editor</button>
                </div>
                <div className="flex flex-row text-2xl">
                  <button onClick={() => toPDF({
                  })}>Export to PDF</button>
                </div>
              </div>
              <div className="flex justify-center items-center w-2/3 h-20 ml-auto border-b-2 border-gray-500"></div>
            </div>

            <div className="flex flex-row" ref={targetRef}>
                <div className="flex flex-col items-center justify-start w-1/3 pl-8 pr-8">
                    <div className="circle">
                        <img className="w-full h-full rounded-full object-cover" src={protfolioData.photoUrl} alt=""/>
                    </div>
                    <label htmlFor="username" className="pt-8 font-semibold">Username</label>
                    <div
                        className="border-2 rounded-2xl w-1/2 border-gray-500 text-center">
                        <span className="break-all">{protfolioData.username}</span>
                    </div>

                    <label htmlFor="fullname" className="pt-2 font-semibold">Full name</label>
                    <div
                        className="border-2 rounded-2xl w-1/2 border-gray-500 text-center">
                        <span className="break-all">{protfolioData.fullName}</span>
                    </div>


                    <label htmlFor="location" className="pt-2 font-semibold">Location</label>
                    <div
                        className="border-2 rounded-2xl w-1/2 border-gray-500 text-center">
                        <span className="break-all">{protfolioData.location}</span>
                    </div>

                    
                    <label htmlFor="role" className="pt-2 font-semibold">Role</label>
                    <div
                        className="border-2 rounded-2xl w-1/2 border-gray-500 text-center">
                        <span className="break-all">{protfolioData.role}</span>
                    </div>

                    <div className="flex flex-col w-1/2">
                        <label htmlFor="bio" className="pt-8 font-semibold">Bio</label>
                        <div
                          className="border-2 rounded-2xl w-full border-gray-500 text-center">
                          <span className="break-all">{protfolioData.bio}</span>
                        </div>
                    </div>
                   
                    <label htmlFor="links" className="pt-6 pb-2 font-semibold">Links</label>
                    {protfolioData.links.map((row, index) => (
                        <div
                            className="block flex-col justify-center items-center text-wrapblock w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                            key={index}>
                            <div>
                                <a href={row} target="_blank" rel="noreferrer"
                                   className="break-all hover:text-orange-500">{row}</a>
                            </div>
                            <br/>
                        </div>
                    ))}
                    <br/>
                </div>

                <div className="flex flex-col w-2/3 mr-5 pt-20 items-center">
                    <label htmlFor="projects" className="flex text-5xl justify-center font-extrabold">
                        MY WORKS
                    </label><br/>
                    <div className="flex flex-row flex-wrap justify-center">
                        {protfolioData.projects.map((project, index) => (
                            <div
                        className="flex flex-col justify-center items-center border-2 border-gray-500 rounded-3xl m-5 p-8 sm:p-10 md:p-12 lg:p-24 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                        key={index}>
                        <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center border-2 cursor-pointer border-gray-500">
                          <img src={project.photoUrl} alt="" className="w-full h-full rounded-full object-cover"/>
                        </div>
                        <p className="border-2 rounded-2xl w-full border-gray-500 text-center font-semibold mt-4 p-2">{project.name}</p>
                        <div className="w-full">
                          <a className="block break-words px-4 justify-center text-center text-black text-base font-medium underline leading-tight mt-4 hover:text-orange-500"
                              href={project.link} target="_blank" rel="noreferrer">See more</a>
                        </div>
                      </div>
                    ))}
                    </div>
                </div>
            </div>
        </body>
  )

}

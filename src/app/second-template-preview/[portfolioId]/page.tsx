"use client"
import {useState, useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseConfig";
import {PortfolioDataPreview} from "@/model/secondTemplateTypes";
import {getSecondTemplatePortfolioData} from "@/functions/databaseAccess";
import {useRouter} from "next/navigation";
import {Poppins, Zen_Tokyo_Zoo} from "next/font/google";
import {usePDF} from "react-to-pdf";

const zenTokyoZoo = Zen_Tokyo_Zoo({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
});
const poppins = Poppins({
    weight: '700',
    style: 'normal',
    subsets: ['latin'],
});

export default function SecondTemplatePreview({ params }: { params: { portfolioId: string } }) {
  const [user, loading, error] = useAuthState(auth);
  const [portfolioData, setPortfolioData] = useState<PortfolioDataPreview | undefined>(undefined);
  const { toPDF, targetRef } = usePDF({filename: `${params.portfolioId}.pdf`});
  
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getSecondTemplatePortfolioData(params.portfolioId).then((data) => {
        setPortfolioData(data);
      });
    }
  }, [params.portfolioId, user]);

  const handleBackToEditor = () => {
    router.push('/second-template-form/' + params.portfolioId);
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

  if (!portfolioData) {
    return (
      <main className="flex justify-center items-center h-screen ">
        <div className="bg-blue-100 text-blue-700 p-4 rounded shadow-md">
          <h1>Loading portfolio data...</h1>
        </div>
      </main>
    );
  }

  return (
      <div className="bg-white">
          <div ref={targetRef}>
            <div className="flex flex-row" 
                 style={{
                     width: '100%', // ширина блока 100% от ширины экрана
                     height: '69vw', // высота блока 75% от ширины экрана (используем vw - viewport width units)
                     backgroundColor: 'lightgray',
                     backgroundImage: "url('/Background_data.png')",
                     backgroundSize: '100%', // чтобы картинка заполняла весь фон блока
                     backgroundRepeat: 'no-repeat'
                 }}
            >
                <div className="personal-photo flex flex-col justify-center items-center w-1/2">
                    <h1 className={`${zenTokyoZoo.className} portfolio-template font-bold text-white xl:text-7xl md:text-6xl sm:text-5xl xs:text-4xl xl:mb-4`}>
                        PORTFOLIO
                    </h1>
                    <div className="flex flex-row w-full justify-between">
                        <div className="w-1/2 xl:m-10 lg:m-8 md:m-6 sm:m-4 xs:m-2">
                            <div className="rectangle">
                                <div className="rectangle-photo relative cursor-pointer">
                                    <img src={portfolioData.photoUrl} alt="" className="w-full h-full object-cover"/>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`${poppins.className} w-1/2 flex flex-col justify-start items-end xl:mt-24 lg:mt-18 md:mt-10 sm:mt-4`}>
                            <div className="users-data-block">
                                <div
                                    className="text-center break-words font-bold text-white xl:text-2xl md:text-xl sm:text-lg xl:m-5 lg:m-4 md:m-3 sm:m-2">
                                    <p>{portfolioData.fullName}</p>
                                </div>
                                <div>
                                    <p>{portfolioData.role}</p>
                                </div>
                            </div>
                        </div>
    
                    </div>
                </div>
                <div className="personal-data flex flex-row w-1/2">
                    <div className="w-2/3 flex justify-center items-center">
                        <div className="about-me-frame">
                            <div className="about-me xl:m-5 lg:m-4 md:m-3 sm:m-2" style={{wordBreak: "break-word"}}>
                                <div className="flex flex-col items-start justify-start m-5 w-full h-full">
                                    <div className="flex flex-row">
                                        <div className="triangle"></div>
                                        <label htmlFor="bio"
                                               className={`${poppins.className} font-black text-red-900 xl:text-3xl md:text-2xl sm:text-xl xs:text-lg xl:mt-10 lg:mt-6 md:mt-4 sm:mt-2 xl:mb-10 lg:mb-6 md:mb-4 sm:mb-2 ml-4 mr-4`}>
                                            ABOUT ME
                                        </label>
                                    </div>
                                    <div
                                        className="border-2 text-red-900 xl:text-lg md:text-base sm:text-base xs:text-base resize-none">
                                        <p>{portfolioData.bio}</p>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="triangle"></div>
                                        <label htmlFor="role"
                                               className={`${poppins.className} font-black text-red-900 xl:text-3xl md:text-2xl sm:text-xl xs:text-lg xl:mt-10 lg:mt-6 md:mt-4 sm:mt-2 xl:mb-10 lg:mb-6 md:mb-4 sm:mb-2 ml-4 mr-4`}>
                                            CONTACT ME
                                        </label>
                                    </div>
                                    <div
                                        className="border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1">
                                        <p>{portfolioData.phoneNumber}</p>
                                    </div>
                                    <div
                                        className="border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1">
                                        <p>{portfolioData.location}</p>
                                    </div>
                                    {portfolioData.links.map((row, index) => (
                                        <div key={row}
                                             className="flex flex-col justify-center text-center items-center w-full"
                                             style={{wordBreak: "break-word", overflowWrap: "break-word"}}>
                                            <div
                                                className="mt-2 border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1">
                                                <p>{row}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
    
                    </div>
                </div>
            </div>
    
            <label htmlFor="projects"></label>
            {portfolioData.projects.map((project, index) => (
                <div key={index} className="mt-5 flex flex-col"
                     style={{
                         width: '100%', // ширина блока 100% от ширины экрана
                         height: '69vw', // высота блока 75% от ширины экрана (используем vw - viewport width units)
                         backgroundColor: 'lightgray',
                         backgroundImage: "url('/Background_project.png')",
                         backgroundSize: '100%', // чтобы картинка заполняла весь фон блока
                         backgroundRepeat: 'no-repeat'
                     }}>
                    <div className="rectangle-vice-versa flex justify-center items-center h-2/6">
                        <div className="rectangle-vice-versa-photo relative cursor-pointer">
                            <img src={project.photoUrl} alt="" className="w-full h-full object-cover"/>
                        </div>
                    </div>
                    <div className="flex justify-center items-center h-1/6">
                        <h1 className={`${poppins.className} flex justify-center items-center font-bold text-white xl:text-8xl md:text-6xl sm:text-5xl xs:text-4xl xl:mb-4`}>
                            PROJECT {index + 1}
                        </h1>
                    </div>
                    <div className="flex flex-row justify-end items-end h-3/6 mr-5">
                        <div className="about-project-frame">
                            <div className="about-project">
                                <div className="flex w-full h-full justify-between items-start">
                                    <div className="flex flex-col w-2/5 m-10">
                                        <div className="flex flex-row">
                                            <div className="triangle"></div>
                                            <label htmlFor={"project-" + index + "-name"}
                                                   className={`${poppins.className} font-black text-red-900 xl:text-3xl md:text-2xl sm:text-xl xs:text-lg xl:mt-5 lg:mt-4 md:mt-3 sm:mt-2 xl:mb-5 lg:mb-4 md:mb-3 sm:mb-2 ml-2`}>
                                                ABOUT THIS JOB
                                            </label>
                                        </div>
                                        <div
                                            className="border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1">
                                            <p>{project.name}</p>
                                        </div>
                                        <div
                                            className="border-2 text-red-900 xl:text-lg md:text-base sm:text-base xs:text-base resize-none">
                                            <p>{project.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-2/5 m-10">
                                        <div className="flex flex-row">
                                            <div className="triangle"></div>
                                            <label htmlFor={"project-" + index + "-link"}
                                                   className={`${poppins.className} font-black text-red-900 xl:text-3xl md:text-2xl sm:text-xl xs:text-lg xl:mt-5 lg:mt-4 md:mt-3 sm:mt-2 xl:mb-5 lg:mb-4 md:mb-3 sm:mb-2 ml-2`}>
                                                PROJECT LINK:
                                            </label>
                                        </div>
                                        <div
                                            className="border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1">
                                            <p>{project.link}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
          <div className="flex justify-between pr-10 pl-10 w-full bg-white pt-5 pb-5">
              <button onClick={handleBackToEditor}>Back to editor</button>
          </div>
          <div className="text-2xl fixed bottom-3 right-5">
              <button onClick={() => toPDF({})}>Export to PDF</button>
          </div>
      </div>
  )
}

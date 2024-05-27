"use client"
import {useState, useEffect} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseConfig";
import {PortfolioDataPreview} from "@/model/firstTemplateTypes";
import {getPortfolioDataForUser} from "@/functions/databaseAccess";
import PublishButton from "@/app/components/PublishButton";


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
  }, [params.portfolioId, user]);

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
      <div className="bg-rose-50 relative font-sans ">
          <div className="gap-1 ml-20 ">
              <div className="w-56 h-56 justify-center items-start inline-flex">
                  <img
                      className="w-56 h-56 justify-center mt-16 items-center gap-2.5 relative rounded-full border border-zinc-600"
                      src={protfolioData.photoPath} alt=""/>
              </div>
              <p className="w-56 grow shrink basis-0 text-center text-zinc-600 text-md mt-6 font-[Plus_Jakarta_Sans]">Username:</p>
              <div
                  className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken max-h-screen bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex mt-2">
                  <span className="w-20 h-5 text-center text-black text-sm font-medium ">{protfolioData.username}</span>
              </div>
              <p className="w-56 grow shrink basis-0 text-center text-zinc-600 text-md font-normal mt-2">Full name:</p>
              <div
                  className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex mt-2">
                  <span className="w-20 h-5 text-center text-black text-sm font-medium">{protfolioData.fullName}</span>
              </div>
              <p className="w-56 grow shrink basis-0 text-center text-zinc-600 text-md font-normal mt-2">Location:</p>
              <div
                  className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex mt-2">
                  <span className="w-20 h-5 text-center text-black text-sm font-medium">{protfolioData.location}</span>
              </div>
              <p className="w-56 grow shrink basis-0 text-center text-zinc-600 text-md font-normal mt-2">Role:</p>
              <div
                  className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex mt-2">
                  <span className="text-center text-black text-sm font-medium">{protfolioData.role}</span>
              </div>
              <p className="w-56 grow shrink basis-0 text-start text-zinc-600 text-md font-normal mt-2">Bio:</p>
              <div
                  className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex">
                  <span className="text-center text-black text-sm font-medium px-4">{protfolioData.bio}</span>
              </div>
              <p className="w-56 grow shrink basis-0 text-start text-zinc-600 text-md font-normal mt-2 mb-2">Links:</p>
              {protfolioData.links.map((row, index) => (
                  <div className="text-balance text-black text-sm font-normal hover:text-orange-500" key={index}>
                      <a href={row} target="_blank" rel="noreferrer">{row}</a>
                  </div>
              ))}
          </div>
          <div className="absolute left-[560px] top-[40px] shrink-0 mt-8 mr-7 max-w-full h-px border border-solid
          bg-stone-500 border-stone-500 w-[825px] max-md:mr-1.5"
          ></div>
          <p className=" w-72 h-10 left-[846px] top-[80px] absolute text-center text-zinc-600 text-5xl font-bold">My
              works</p><br/>
          <div className="absolute left-[560px] top-[104px] flex justify-center items-center gap-8 pb-8 self-stretch ">
              {protfolioData.projects.map((project, index) => (
                  <div
                      className="max-w-64 max-h-72 rounded-[50px] shadow border border-zinc-600 mt-16 flex flex-col
                      justify-center items-center px-16 pt-6 pb-14 max-md:px-5 max-md:mt-8 hover:shadow-xl transition-shadow duration-300"
                      key={index}>
                      <p className="hidden">Project photo:</p>
                      <div className=" relative w-32 items-center justify-center ">
                          <img className="w-32 h-32 mt-4 flex justify-center rounded-full border border-zinc-600 self-center
                    max-w-full aspect-square" src={project.photoPath} alt=""/>
                      </div>
                      <p className="hidden">Project name:</p>
                      <p className="self-stretch text-balance text-center text-black text-2xl font-medium mt-4 ">{project.name}</p>
                      <p className="hidden">Project link:</p>
                      <div className="w-full ">
                          <a className="block break-words px-4 justify-center text-center text-black text-base font-medium
                           underline leading-tight mt-4 hover:text-orange-500"
                             href={project.link} target="_blank" rel="noreferrer">See more</a>
                      </div>
                  </div>
              ))}
          </div>
          <PublishButton portfolioId={params.portfolioId} openPublishedPortfolio={true}></PublishButton>
      </div>
  )

}

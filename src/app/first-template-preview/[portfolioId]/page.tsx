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
      <main className="flex justify-center items-center h-screen ">
        <div className="bg-blue-100 text-blue-700 p-4 rounded shadow-md">
          <h1>Loading portfolio data...</h1>
        </div>
      </main>
    );
  }

  return (
    <div className="bg-rose-50 relative ">
        <div className="gap-1 ml-20 ">
            <div className="w-56 h-56 justify-center items-start inline-flex">
                <img className="w-56 h-56 justify-center mt-16 items-center gap-2.5 relative rounded-full border border-zinc-600" src={protfolioData.photoPath} alt=""/>
            </div>
            <p className="w-56 grow shrink basis-0 text-center text-zinc-600 text-md font-normal mt-6">Username:</p>
            <div className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex mt-2">
            <span className="w-20 h-5 text-center text-black text-sm font-normall">{protfolioData.username}</span>
            </div>
            <p className="w-56 grow shrink basis-0 text-center text-zinc-600 text-md font-normal mt-2">Full name:</p>
            <div className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex mt-2">
                <span className="w-20 h-5 text-center text-black text-sm font-normal">{protfolioData.fullName}</span>
            </div>
            <p className="w-56 grow shrink basis-0 text-center text-zinc-600 text-md font-normal mt-2">Location:</p>
            <div className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex mt-2">
                <span className="w-20 h-5 text-center text-black text-sm font-normal">{protfolioData.location}</span>
            </div>
            <p className="w-56 grow shrink basis-0 text-center text-zinc-600 text-md font-normal mt-2">Role:</p>
            <div className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex mt-2">
                <span className="text-center text-black text-sm font-normal">{protfolioData.role}</span>
            </div>
            <p className="w-56 grow shrink basis-0 text-start text-zinc-600 text-md font-normal mt-2">Bio:</p>
            <div className="w-56 pl-15 pr-15 py-1.5 mix-blend-darken bg-white rounded-3xl border border-zinc-500 justify-center items-center inline-flex">
                <span className="text-center text-black text-sm font-normal">{protfolioData.bio}</span>
            </div>
            <p className="w-56 grow shrink basis-0 text-start text-zinc-600 text-md font-normal mt-2 mb-2">Links:</p>
            {protfolioData.links.map((row, index) => (
                <div className="text-black text-sm font-normal" key={index}>
                    <a href={row} target="_blank" rel="noreferrer">{row}</a>
                </div>
            ))}
        </div>
        <p className="w-72 h-10 left-[846px] top-[100px] absolute text-center text-zinc-600 text-5xl font-bold">My works:</p><br/>
        {protfolioData.projects.map((project, index) => (
            <div key={index}>
                <p>Project photo:</p>
                <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
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

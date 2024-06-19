"use client"
import {useState} from "react";
import {PortfolioData} from "@/model/secondTemplateTypes";
import {saveSecondTemplateDataForUser} from "@/functions/databaseAccess";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseConfig";
import {PortfolioStatus} from "@/portfolioStatuses";
import { Zen_Tokyo_Zoo, Poppins } from 'next/font/google';
import Image from "next/image";

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

type LinkRow = {
    id: number;
    link: string;
}
type ProjectRow = {
    id: number;
    photo: File | null;
    photoPath: string;
    name: string;
    description: string;
    link: string;
}

export default function FirstTemplateForm(){
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPath, setPhotoPath] = useState<string>("");
    const [fullname, setFullname] = useState<string>("");
    const [profession, setProfession] = useState<string>("");
    const [aboutMe, setAboutMe] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [linksRows, setLinksRows] = useState<LinkRow[]>([]);
    const [projects, setProjects] = useState<ProjectRow[]>([]);

    const [user, loading, error] = useAuthState(auth);

    const handleSave = async () => {
        const data: PortfolioData = {
            name: "New Portfolio",
            link: "",
            status: PortfolioStatus.DRAFT,
            photo,
            phoneNumber: phoneNumber,
            fullName: fullname,
            location,
            role: profession,
            bio: aboutMe,
            links: linksRows.map((row) => row.link),
            projects: projects.map((project) => ({
                photo: project.photo,
                name: project.name,
                description: project.description,
                link: project.link,
            })),
        }
        if (user){
            await saveSecondTemplateDataForUser(user.uid, data);
        }
    };


    const handleAddLink = () => {
        setLinksRows([...linksRows, {id: linksRows.length, link: ""}]);
    }

    const onLinkChange = (index: number, value: string) => {
        setLinksRows(linksRows.map((row) => row.id === index ? {...row, link: value} : row));
    };

    const handleDeleteLink = (id: number) => {
        setLinksRows(linksRows.filter((row) => row.id !== id));
    };

    const handleAddProject = () => {
        let projectId = 1;
        if (projects.length > 0) {
            projectId = projects[projects.length - 1].id + 1;
        }
        setProjects([...projects, {id: projectId, photo: null, name: "", description: "", link: "", photoPath: ""}]);
    };

    const handleEditProjectPhoto = (index: number, photo: File, photoPath: string) => {
        setProjects(projects.map((project) => project.id === index ? {...project, photo, photoPath: photoPath} : project));
    };

    const handleEditProjectName = (index: number, name: string) => {
        setProjects(projects.map((project) => project.id === index ? {...project, name} : project));
    };

    const handleEditProjectDescription = (index: number, description: string) => {
        setProjects(projects.map((project) => project.id === index ? {...project, description} : project));
    }

    const handleEditProjectLink = (index: number, link: string) => {
        setProjects(projects.map((project) => project.id === index ? {...project, link} : project));
    };

    const handleDeleteProject = (index: number) => {
        setProjects(projects.filter((project) => project.id !== index));
    };

    //This code is used to adjust the height of the block according to the image size




    if (loading) {
        return (
            <main className="flex justify-center items-center h-screen">
                <div className="bg-blue-100 text-blue-700 p-4 rounded shadow-md">
                    <h1>Loading...</h1>
                </div>
            </main>
        );
    }

    if(!user){
        return (
            <main className="flex justify-center items-center h-screen">
                <div className="bg-red-100 text-red-700 p-4 rounded shadow-md">
                    <h1>Not authorized</h1>
                </div>
            </main>
        );
    }

    return (
        <div className="bg-white">
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
                                <input
                                    className="hidden"
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    onChange={({ target }) => {
                                        if (target.files) {
                                            const file = target.files[0];
                                            setPhotoPath(URL.createObjectURL(file));
                                            setPhoto(file);
                                        }
                                    }}
                                />
                                <div
                                    className="rectangle-photo relative cursor-pointer"
                                    onClick={() => document.getElementById('photo')?.click()}
                                >
                                    {photoPath ? (
                                        <img src={photoPath} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src="/Vector.png" alt="" className="absolute inset-0 w-full h-full object-contain" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`${poppins.className} w-1/2 flex flex-col justify-start items-end xl:mt-24 lg:mt-18 md:mt-10 sm:mt-4`}>
                            <div className="users-data-block">
                                <div className="text-center break-words font-bold text-white xl:text-2xl md:text-xl sm:text-lg xl:m-5 lg:m-4 md:m-3 sm:m-2">
                                    <label htmlFor="fullName"></label>
                                    <input
                                        className="border-b-2 border-white bg-transparent text-center placeholder-white cursor-pointer w-full"
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Enter full name"
                                        value={fullname}
                                        onChange={({target}) => setFullname(target.value)}
                                    />
                                </div>
                                <div className="text-center break-words text-white xl:text-lg md:text-base xl:m-5 lg:m-4 md:m-3 sm:m-2">
                                    <label htmlFor="profession"></label>
                                    <input
                                        className="border-b-2 border-white bg-transparent text-center placeholder-white cursor-pointer w-full"
                                        type="text"
                                        id="profession"
                                        name="profession"
                                        placeholder="Enter profession"
                                        value={profession}
                                        onChange={({target}) => setProfession(target.value)}
                                    />
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
                                        <label htmlFor="bio" className={`${poppins.className} font-black text-red-900 xl:text-3xl md:text-2xl sm:text-xl xs:text-lg xl:mt-10 lg:mt-6 md:mt-4 sm:mt-2 xl:mb-10 lg:mb-6 md:mb-4 sm:mb-2 ml-4 mr-4`}>
                                            ABOUT ME
                                        </label>
                                    </div>
                                    <textarea
                                        className="border-2 text-red-900 xl:text-lg md:text-base sm:text-base xs:text-base resize-none"
                                        id="aboutMe"
                                        name="aboutMe"
                                        value={aboutMe}
                                        onChange={({target}) => setAboutMe(target.value)}  
                                        style={{ height: '35%', width: '100%'}}></textarea>
                                    <div className="flex flex-row">
                                        <div className="triangle"></div>
                                        <label htmlFor="role" className={`${poppins.className} font-black text-red-900 xl:text-3xl md:text-2xl sm:text-xl xs:text-lg xl:mt-10 lg:mt-6 md:mt-4 sm:mt-2 xl:mb-10 lg:mb-6 md:mb-4 sm:mb-2 ml-4 mr-4`}>
                                            CONTACT ME
                                        </label>
                                    </div>
                                    <input
                                        className="border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1"
                                        type="text"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        placeholder="+380 (XX) XXX-XX-XX"
                                        onChange={({target}) => setPhoneNumber(target.value)}/>
                                    <label htmlFor="location"></label>
                                    <input
                                        className="border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1"
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={location}
                                        placeholder="Enter your location"
                                        onChange={({target}) => setLocation(target.value)}/>
                                    <label htmlFor="links"></label>
                                    {linksRows.map((row) => (
                                        <div key={row.id} className="flex flex-col justify-center text-center items-center w-full" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                                            <input
                                                className="mt-2 border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1"
                                                type="url"
                                                id="links"
                                                name="links"
                                                value={linksRows[row.id].link}
                                                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                                                onChange={({target}) => onLinkChange(row.id, target.value)}
                                            />
                                            <button onClick={() => handleDeleteLink(row.id)} className="w-1/4 text-sm border-2 border-gray-400 bg-gray-200 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400">
                                                Delete</button>
                                        </div>
                                    ))}
                                    <div className="flex flex-row justify-center text-center items-center w-full">
                                        <button onClick={handleAddLink} className="mt-2 mb-3 w-1/4 text-sm border-2 border-gray-400 bg-gray-200 text-gray-600 px-1 py-0.5 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400">Add Link</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>        

            <label htmlFor="projects"></label>
            {projects.map((project, index) => (
                <div key={project.id} className="mt-5 flex flex-col"
                style={{
                    width: '100%', // ширина блока 100% от ширины экрана
                    height: '69vw', // высота блока 75% от ширины экрана (используем vw - viewport width units)
                    backgroundColor: 'lightgray',
                    backgroundImage: "url('/Background_project.png')",
                    backgroundSize: '100%', // чтобы картинка заполняла весь фон блока
                    backgroundRepeat: 'no-repeat'
                }}>
                    <div className="rectangle-vice-versa flex justify-center items-center h-2/6">
                        <label htmlFor="project-photo"></label>
                        <input
                            className="hidden"
                            type="file"
                            id={"project-" + project.id + "-photo"}
                            name="project-photo"
                            onChange={({target}) => {
                                if (target.files) {
                                    const file = target.files[0];
                                    handleEditProjectPhoto(project.id, file, URL.createObjectURL(file));
                                }
                            }}/>
                        <div
                            className="rectangle-vice-versa-photo relative cursor-pointer"
                            onClick={() => document.getElementById("project-" + project.id + "-photo")?.click()}>
                            {project.photoPath ? (
                                <img src={project.photoPath} alt="" className="w-full h-full object-cover"/>
                            ) : (
                                <span><img src="/Vector.png" alt="" style={{ height: "30px" }} /></span>
                            )}
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
                                            <label htmlFor={"project-" + project.id + "-name"} className={`${poppins.className} font-black text-red-900 xl:text-3xl md:text-2xl sm:text-xl xs:text-lg xl:mt-5 lg:mt-4 md:mt-3 sm:mt-2 xl:mb-5 lg:mb-4 md:mb-3 sm:mb-2 ml-2`}>
                                                ABOUT THIS JOB
                                            </label>
                                        </div>
                                        <input
                                            className="border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1"
                                            type="text"
                                            id={"project-" + project.id + "-name"}
                                            name="project-name"
                                            value={project.name}
                                            placeholder="Name the project"
                                            onChange={({target}) => handleEditProjectName(project.id, target.value)}/>
                                        <label htmlFor="project-name"></label>
                                        <textarea //Probably here should be texarea, not input
                                            className="border-2 text-red-900 xl:text-lg md:text-base sm:text-base xs:text-base resize-none"
                                            //type="text"
                                            id="description"
                                            name="description"
                                            value={project.description}
                                            style={{ height: '150px', width: '100%'}}
                                            onChange={({target}) => handleEditProjectDescription(project.id, target.value)}></textarea>
                                    </div>
                                    <div className="flex flex-col w-2/5 m-10">
                                        <div className="flex flex-row">
                                            <div className="triangle"></div>
                                            <label htmlFor={"project-" + project.id + "-link"} className={`${poppins.className} font-black text-red-900 xl:text-3xl md:text-2xl sm:text-xl xs:text-lg xl:mt-5 lg:mt-4 md:mt-3 sm:mt-2 xl:mb-5 lg:mb-4 md:mb-3 sm:mb-2 ml-2`}>
                                                PROJECT LINK:
                                            </label>
                                        </div>
                                        <input
                                            className="border-b-2 border-gray-200 text-red-900 w-full xl:text-lg md:text-base sm:text-base xs:text-base cursor-pointer xl:mb-5 lg:mb-3 md:mb-1 sm:mb-1"
                                            type="text"
                                            id={"project-" + project.id + "-link"}
                                            name="project-link"
                                            value={project.link}
                                            placeholder="Link the project"
                                            onChange={({target}) => handleEditProjectLink(project.id, target.value)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center h-1/6">
                        <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
            <div className="flex justify-center items-center w-full bg-gray-300 shadow-md p-5 mb-5">
                <button
                    onClick={handleAddProject}
                    className="px-4 py-2 bg-gray-400 text-gray-700 font-bold rounded-md shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Add Project
                </button>
            </div>
            <div className="flex justify-between pr-10 pl-10 w-full bg-white pt-5 pb-5">
                <div>
                     <button className="mr-4"> {/*TODO return to the previous page*/}
                        <Image src="/ArrowPrev.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                </div>
                <div className="flex justify-between">
                    <button className="mr-4"> {/*TODO preview button*/}
                        <Image src="/PreviewButton.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                    <button className="mr-4"> {/*TODO publish button*/}
                        <Image src="/PublishButton.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                    <button onClick={handleSave}>
                        <Image src="/SaveButton.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}
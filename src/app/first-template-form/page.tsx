"use client"

import {useState} from "react";
import {PortfolioData} from "@/model/types";
import {savePortfolioDataForUser} from "@/functions/databaseAccess";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseConfig";
import {PortfolioStatus} from "@/portfolioStatuses";
import Image from "next/image";

type LinkRow = {
    id: number;
    link: string;
}
type ProjectRow = {
    id: number;
    photo: File | null;
    name: string;
    link: string;
    photoPath: string;
}

// const getDefaultBackgroundColor = () => {
//     return "bg-white";
// };

export default function FirstTemplateForm(){
    const [linksRows, setLinksRows] = useState<LinkRow[]>([]);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPath, setPhotoPath] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [fullname, setFullname] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [projects, setProjects] = useState<ProjectRow[]>([]);
    const [user, loading, error] = useAuthState(auth);


    const handleSave = async () => {
        const data: PortfolioData = {
            name: "New Portfolio",
            link: "",
            status: PortfolioStatus.DRAFT,
            photo,
            username,
            fullName: fullname,
            location,
            role,
            bio,
            links: linksRows.map((row) => row.link),
            projects: projects.map((project) => ({
                photo: project.photo,
                name: project.name,
                link: project.link,
            })),
        }
        if (user){
            await savePortfolioDataForUser(user.uid, data);
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
        setProjects([...projects, {id: projects.length, photo: null, name: "", link: "", photoPath: ""}]);
    };

    const handleEditProjectPhoto = (index: number, photo: File, photoPath: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, photo, photoPath} : project));
    };

    const handleEditProjectName = (index: number, name: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, name} : project));
    };

    const handleEditProjectLink = (index: number, link: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, link} : project));
    };

    const handleDeleteProject = (index: number) => {
        setProjects(projects.filter((project, i) => i !== index));
    };


    // const [isMenuOpen, setIsMenuOpen] = useState(false);

    // const toggleMenu = () => {
    //     setIsMenuOpen(!isMenuOpen);
    // };

    // const [backgroundColor, setBackgroundColor] = useState("bg-gradient-to-b from-yellow-100 to-blue-100");

    // const handleColorChange = (color: string) => {
    //     switch (color) {
    //         case "orange":
    //             setBackgroundColor("bg-orange-100");
    //             break;
    //         case "blue":
    //             setBackgroundColor("bg-blue-100");
    //             break;
    //         case "green":
    //             setBackgroundColor("bg-green-100");
    //             break;
    //         default:
    //             setBackgroundColor(getDefaultBackgroundColor());
    //             break;
    //     }
    // };

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
        // <div className={`font-cursive ${backgroundColor}`}>
        <div className="font-cursive bg-white">
            {/* {isMenuOpen && ( 
                <div className="flex flex-row w-full justify-end pr-20 pt-5">}
                    <button className="bg-orange-200 hover:bg-orange-300 text-gray font-semibold py-2 px-4 rounded-md mr-2 border-2 border-gray-500" onClick={() => handleColorChange("orange")}>Orange</button>
                    <button className="bg-blue-200 hover:bg-blue-300 text-gray font-semibold py-2 px-4 rounded-md mr-2 border-2 border-gray-500" onClick={() => handleColorChange("blue")}>Blue</button>
                    <button className="bg-green-200 hover:bg-green-300 text-gray font-semibold py-2 px-4 rounded-md mr-2 border-2 border-gray-500" onClick={() => handleColorChange("green")}>Green</button>
                    <button className="bg-white hover:bg-gray-100 text-gray font-semibold py-2 px-4 rounded-md border-2 border-gray-500" onClick={() => handleColorChange("default")}>Default</button>
                </div>)} */}
            <div className="flex flex-row pl-20 pr-20">
                <div className="flex justify-end items-center w-2/3 h-20 ml-auto border-b-2 border-gray-500">
                    <button className="mr-4"> {/*TODO send to the previous page*/}
                        <Image src="/ArrowPrev.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                    <button className="mr-4"> {/*onClick={toggleMenu}}*/} {/*TODO change template color*/}
                        <Image src="/ColorPalette.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                    <button className="mr-4"> {/*TODO show preview*/}
                        <Image src="/PreviewButton.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                    <button
                        onClick={handleSave}> {/*TODO save changes*/}
                        <Image src="/SaveButton.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                </div>
            </div>
            
            <div className="flex flex-row">
                <div className="flex flex-col items-center justify-start w-1/3 pl-8 pr-8">
                    <label htmlFor="photo"></label> 
                    <input
                        className="hidden"
                        type="file"
                        id="photo"
                        name="photo"
                        onChange={({target}) => {
                            if (target.files) {
                                const file = target.files[0];
                                setPhotoPath(URL.createObjectURL(file));
                                setPhoto(file);
                            }
                        }}/><br/>
                    <div
                        className="w-60 h-60 bg-white rounded-full flex items-center justify-center border-2 cursor-pointer border-gray-500"
                        onClick={() => document.getElementById('photo')?.click()}>
                        {photoPath ? (
                            <img src={photoPath} alt="" className="w-full h-full rounded-full object-cover"/>
                        ) : (
                            <span><img src="/Vector.png" alt="" style={{height: "30px"}}/></span>
                        )}
                    </div>
                    <label htmlFor="username" className="pt-8 font-semibold">Username</label>
                    <input
                        className="border-2 rounded-2xl w-1/2 border-gray-500"
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={({target}) => setUsername(target.value)}/>
                    <label htmlFor="fullname" className="pt-2 font-semibold">Full name</label>
                    <input
                        className="border-2 rounded-2xl w-1/2 border-gray-500"
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={fullname}
                        onChange={({target}) => setFullname(target.value)}/>
                    <label htmlFor="location" className="pt-2 font-semibold">Location</label>
                    <input
                        className="border-2 rounded-2xl w-1/2 border-gray-500"
                        type="text"
                        id="location"
                        name="location"
                        value={location}
                        onChange={({target}) => setLocation(target.value)}/>
                    <label htmlFor="role" className="pt-2 font-semibold">Role</label>
                    <input
                        className="border-2 rounded-2xl w-1/2 border-gray-500"
                        type="text"
                        id="role"
                        name="role"
                        value={role}
                        onChange={({target}) => setRole(target.value)}/>


                    <div className="flex flex-col w-1/2">
                        <label htmlFor="bio" className="pt-8 font-semibold">Bio</label>
                        <textarea
                            className="border-2 rounded-2xl w-full border-gray-500"
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={({ target }) => setBio(target.value)}></textarea>
                    </div>

                    <label htmlFor="links" className="pt-6 pb-2 font-semibold">Links</label>
                    {linksRows.map((row) => (
                        <div key={row.id}>
                            <div className="flex flex-col justify-center items-center">
                                <input
                                    className="border-2 rounded-2xl w-full border-gray-500"
                                    type="url"
                                    id="links"
                                    name="links"
                                    value={linksRows[row.id].link}
                                    onChange={({target}) => onLinkChange(row.id, target.value)}
                                /><br/>
                                <button onClick={() => handleDeleteLink(row.id)} className="text-gray font-semibold underline">Delete</button>
                                <br/>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleAddLink} className="bg-gray-200 hover:bg-gray-300 text-gray font-semibold py-2 px-6 rounded-full flex items-center">Add Link</button>
                    <br/>
                </div>


                <div className="flex flex-col w-2/3 pr-20 pt-20 items-center">
                    <label htmlFor="projects" className="text-5xl">
                        MY WORKS
                    </label><br/>
                    <div className="flex flex-row flex-wrap justify-center">
                        {projects.map((project) => (
                            <div key={project.id} className="flex flex-col justify-center items-center border-2 border-gray-500 rounded-3xl m-5 pl-32 pr-32 pt-4 pb-4">
                                <label htmlFor="project-photo"></label>
                                <input
                                    className="hidden"
                                    type="file"
                                    id="project-photo"
                                    name="project-photo"
                                    onChange={({target}) => {
                                        if (target.files) {
                                            const file = target.files[0];
                                            handleEditProjectPhoto(project.id, file, URL.createObjectURL(file));
                                        }
                                    }}/>
                                <div
                                    className="w-40 h-40 bg-white rounded-full flex items-center justify-center border-2 cursor-pointer border-gray-500"
                                    onClick={() => document.getElementById('project-photo')?.click()}>
                                    { project.photoPath ? (
                                        <img src={project.photoPath} alt="" className="w-full h-full rounded-full object-cover"/>
                                    ) : (
                                        <span><img src="/Vector.png" alt="" style={{height: "30px"}}/></span>
                                    )}
                                </div>
                                <label htmlFor="project-name" className="pt-2 font-semibold">Project name</label>
                                <input
                                    className="border-2 rounded-2xl w-full border-gray-500"
                                    type="text"
                                    id="project-name"
                                    name="project-name"
                                    value={project.name}
                                    onChange={({target}) => handleEditProjectName(project.id, target.value)}/>
                                <label htmlFor="project-link" className="pt-2 font-semibold">Project link</label>
                                <input
                                    className="border-2 rounded-2xl w-full border-gray-500"
                                    type="text"
                                    id="project-link"
                                    name="project-link"
                                    value={project.link}
                                    onChange={({target}) => handleEditProjectLink(project.id, target.value)}/>
                                <button onClick={() => handleDeleteProject(project.id)} className="bg-gray-200 hover:bg-gray-300 text-gray font-semibold py-2 px-6 rounded-full flex items-center mt-4">Delete</button>
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={handleAddProject} className="bg-gray-200 hover:bg-gray-300 text-gray font-semibold py-2 px-6 rounded-full flex items-center">Add Project</button><br/>
                </div>
            </div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
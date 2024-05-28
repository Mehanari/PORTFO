"use client"
import {useEffect, useState} from "react";
import {PortfolioData} from "@/model/firstTemplateTypes";
import {
    downloadImage,
    getFirstTemplatePortfolioData, publishPortfolio,
    saveFirstTemplateDataForUser,
    updateFirstTemplateDataForUser, userHasPortfolios
} from "@/functions/databaseAccess";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseConfig";
import {PortfolioStatus} from "@/portfolioStatuses";
import {validateFirstTemplateData} from "@/functions/validation";
import {useRouter} from "next/navigation";
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

export default function FirstTemplateForm({ params }: { params: { portfolioIds: string[] } }){
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
    const [docId, setDocId] = useState<string | undefined>();
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (params.portfolioIds){
            setDocId(params.portfolioIds[0]);
            getFirstTemplatePortfolioData(params.portfolioIds[0]).then( async (data) =>
            {
                if (data){
                    setPhotoPath(data.photoUrl);
                    setUsername(data.username);
                    setFullname(data.fullName);
                    setLocation(data.location);
                    setRole(data.role);
                    setBio(data.bio);
                    setLinksRows(data.links.map((link, index) => ({id: index, link})));
                    const projectsPhotosUrls = data.projects.map((proj) => ({url: proj.photoUrl}));
                    const projectPhotos : File[] = [];
                    for(const link of projectsPhotosUrls){
                        const file = await downloadImage(link.url);
                        if (file){
                            projectPhotos.push(file);
                        }
                    }
                    const loadedProjects = data.projects.map((project, index) => ({
                        id: index,
                        photoPath: project.photoUrl,
                        photo: projectPhotos[index],
                        name: project.name,
                        link: project.link
                    }));
                    setProjects(loadedProjects);
                    const photo = await downloadImage(data.photoUrl);
                    if (photo){
                        setPhoto(photo);
                    }
                }
            });
        }
    }, [params]);

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
            const validationResults = validateFirstTemplateData(data);
            if (validationResults.isValid){
                if (docId){
                    await updateFirstTemplateDataForUser(user.uid, data, docId);
                }
                else {
                    const savedDocId = await saveFirstTemplateDataForUser(user.uid, data);
                    if (!docId){
                        router.push(`/first-template-form/${savedDocId}`);
                    }
                }
            }
            else {
                alert(validationResults.message);
            }
        }
    };

    const handlePreview = () => {
        if (docId){
            router.push(`/first-template-preview/${docId}`)
        }
    }

    const handleAddLink = () => {
        let linkId = 1;
        if (linksRows.length > 0) {
            linkId = linksRows[linksRows.length - 1].id + 1;
        }
        setLinksRows([...linksRows, {id: linkId, link: ""}]);
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
        setProjects([...projects, {id: projectId, photo: null, name: "", link: "", photoPath: ""}]);
    };

    const handleEditProjectPhoto = (index: number, photo: File, photoPath: string) => {
        setProjects(projects.map((project) => project.id === index ? {...project, photo, photoPath: photoPath} : project));
    };

    const handleEditProjectName = (index: number, name: string) => {
        setProjects(projects.map((project) => project.id === index ? {...project, name} : project));
    };

    const handleEditProjectLink = (index: number, link: string) => {
        setProjects(projects.map((project) => project.id === index ? {...project, link} : project));
    };

    const handleDeleteProject = (index: number) => {
        setProjects(projects.filter((project) => project.id !== index));
    };

    const handlePublish = async () => {
        if (docId){
            const publishedPageLink = await publishPortfolio(docId);
            if (publishedPageLink){
                router.push(publishedPageLink);
            }
        }
    }

    const handleExit = async () => {
        if (user){
            if (await userHasPortfolios(user.uid)){
                router.push("/portfolio-list");
            }
            else {
                router.push("/choose-template");
            }
        }
    }
    
    if (loading || dataIsLoading) {
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
        <body className="font-cursive" style={{background: "#FFF0F5"}}>
            {/* {isMenuOpen && ( 
                <div className="flex flex-row w-full justify-end pr-20 pt-5">}
                    <button className="bg-orange-200 hover:bg-orange-300 text-gray font-semibold py-2 px-4 rounded-md mr-2 border-2 border-gray-500" onClick={() => handleColorChange("orange")}>Orange</button>
                    <button className="bg-blue-200 hover:bg-blue-300 text-gray font-semibold py-2 px-4 rounded-md mr-2 border-2 border-gray-500" onClick={() => handleColorChange("blue")}>Blue</button>
                    <button className="bg-green-200 hover:bg-green-300 text-gray font-semibold py-2 px-4 rounded-md mr-2 border-2 border-gray-500" onClick={() => handleColorChange("green")}>Green</button>
                    <button className="bg-white hover:bg-gray-100 text-gray font-semibold py-2 px-4 rounded-md border-2 border-gray-500" onClick={() => handleColorChange("default")}>Default</button>
                </div>)} */}
            <div className="flex flex-row pl-20 pr-20">
                <div className="flex justify-end items-center w-2/3 h-20 ml-auto border-b-2 border-gray-500">
                    <button onClick={handleExit} className="mr-4">
                        <Image src="/ArrowPrev.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                    <button className="mr-4"> {/*onClick={toggleMenu}}*/} {/*TODO change template color*/}
                        <Image src="/ColorPalette.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                    <button onClick={handlePreview} className="mr-4">
                        <Image src="/PreviewButton.png" alt="" width={54} height={54} className="mr-2" />
                    </button>
                    <button onClick={handlePublish} className="mr-4">
                        <Image src="/PublishButton.png" alt="" width={54} height={54} className="mr-2" />
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
                        className="circle"
                        onClick={() => document.getElementById('photo')?.click()}>
                        {photoPath ? (
                            <img src={photoPath} alt="" className="w-full h-full rounded-full object-cover"/>
                        ) : (
                            <span><img src="/Vector.png" alt="" style={{height: "30px"}}/></span>
                        )}
                    </div>
                    <label htmlFor="username" className="pt-8 font-semibold">Username</label>
                    <input
                        className="border-2 rounded-2xl w-1/2 border-gray-500 text-center break-words"
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={({target}) => setUsername(target.value)}/>
                    <label htmlFor="fullname" className="pt-2 font-semibold">Full name</label>
                    <input
                        className="border-2 rounded-2xl w-1/2 border-gray-500 text-center break-words"
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={fullname}
                        onChange={({target}) => setFullname(target.value)}/>
                    <label htmlFor="location" className="pt-2 font-semibold">Location</label>
                    <input
                        className="border-2 rounded-2xl w-1/2 border-gray-500 text-center break-words"
                        type="text"
                        id="location"
                        name="location"
                        value={location}
                        onChange={({target}) => setLocation(target.value)}/>
                    <label htmlFor="role" className="pt-2 font-semibold">Role</label>
                    <input
                        className="border-2 rounded-2xl w-1/2 border-gray-500 text-center break-words"
                        type="text"
                        id="role"
                        name="role"
                        value={role}
                        onChange={({target}) => setRole(target.value)}/>


                    <div className="flex flex-col w-1/2">
                        <label htmlFor="bio" className="pt-8 font-semibold">Bio</label>
                        <textarea
                            className="border-2 rounded-2xl w-full border-gray-500 text-center break-words"
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
                                    className="border-2 rounded-2xl w-full border-gray-500 text-center break-words"
                                    type="url"
                                    id="links"
                                    name="links"
                                    value={row.link}
                                    onChange={({target}) => onLinkChange(row.id, target.value)}
                                />
                                <button onClick={() => handleDeleteLink(row.id)} className="text-gray font-semibold underline">Delete</button>
                                <br/>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleAddLink} className="bg-gray-200 hover:bg-gray-300 text-gray font-semibold py-2 px-6 rounded-full flex items-center">Add Link</button>
                    <br/>
                </div>
                <div className="flex flex-col w-2/3 mr-5 pt-20 items-center">
                    <label htmlFor="projects" className="flex text-5xl justify-center font-extrabold">
                        MY WORKS
                    </label><br/>
                    <div className="flex flex-row flex-wrap justify-center">
                    {projects.map((project) => (
                        <div key={project.id} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl m-5">
                            <div className="pt-full relative flex flex-col justify-center items-center border-2 border-gray-500 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-24">
                            <label htmlFor={"project-" + project.id + "-photo"} className="hidden"></label>
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
                                }}
                            />
                            <div
                                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center border-2 cursor-pointer border-gray-500"
                                onClick={() => document.getElementById("project-" + project.id + "-photo")?.click()}>
                                {project.photoPath ? (
                                <img src={project.photoPath} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                <span><img src="/Vector.png" alt="" style={{ height: "30px" }} /></span>
                                )}
                            </div>
                            <label htmlFor={"project-" + project.id + "-name"} className="pt-2 font-semibold">Project name</label>
                            <input
                                className="border-2 rounded-2xl w-full border-gray-500 text-center break-words"
                                type="text"
                                id={"project-" + project.id + "-name"}
                                name="project-name"
                                value={project.name}
                                onChange={({target}) => handleEditProjectName(project.id, target.value)}
                            />
                            <label htmlFor={"project-" + project.id + "-link"} className="pt-2 font-semibold">Project link</label>
                            <input
                                className="border-2 rounded-2xl w-full border-gray-500 text-center break-words"
                                type="text"
                                id={"project-" + project.id + "-link"}
                                name="project-link"
                                value={project.link}
                                onChange={({target}) => handleEditProjectLink(project.id, target.value)}
                            />
                            <button onClick={() => handleDeleteProject(project.id)} className="bg-gray-200 hover:bg-gray-300 text-gray font-semibold py-2 px-6 rounded-full flex items-center mt-4">Delete</button>
                            </div>
                        </div>
                        ))}
                    </div>
                    <button onClick={handleAddProject} className="bg-gray-200 hover:bg-gray-300 text-gray font-semibold py-2 px-6 rounded-full flex items-center">Add Project</button><br/>
                </div>
            </div>
        </body>
    );
}
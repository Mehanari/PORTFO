"use client"
import {useState} from "react";
import {PortfolioData} from "@/model/secondTemplateTypes";
import {saveSecondTemplateDataForUser} from "@/functions/databaseAccess";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseConfig";
import {PortfolioStatus} from "@/portfolioStatuses";

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
        setProjects([...projects, {id: projects.length, photo: null, name: "", description: "", link: "", photoPath: ""}]);
    };

    const handleEditProjectPhoto = (index: number, photo: File, photoPath: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, photo, photoPath} : project));
    };

    const handleEditProjectName = (index: number, name: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, name} : project));
    };

    const handleEditProjectDescription = (index: number, description: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, description} : project));
    }

    const handleEditProjectLink = (index: number, link: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, link} : project));
    };

    const handleDeleteProject = (index: number) => {
        setProjects(projects.filter((project, i) => i !== index));
    };

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
        <div>
            <label htmlFor="photo">Change photo:</label><br/>
            <input
                className="border-2"
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
                className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                {photoPath ? (
                    <img src={photoPath} alt=""/>
                ) : (
                    <span>Select Image</span>
                )}
            </div>
            <label htmlFor="fullName">Full name:</label><br/>
            <input
                className="border-2"
                type="text"
                id="fullName"
                name="fullName"
                value={fullname}
                onChange={({target}) => setFullname(target.value)}/><br/>
            <label htmlFor="profession">Profession:</label><br/>
            <input
                className="border-2"
                type="text"
                id="profession"
                name="profession"
                value={profession}
                onChange={({target}) => setProfession(target.value)}/><br/>
            <label htmlFor="bio">About me:</label><br/>
            <textarea
                className="border-2"
                id="aboutMe"
                name="aboutMe"
                value={aboutMe}
                onChange={({target}) => setAboutMe(target.value)}></textarea><br/>
            <label htmlFor="role">Contact me:</label><br/>
            <input
                className="border-2"
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={({target}) => setPhoneNumber(target.value)}/><br/>
            <label htmlFor="location">Location:</label><br/>
            <input
                className="border-2"
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={({target}) => setLocation(target.value)}/><br/>
            <label htmlFor="links">Links:</label><br/>
            {linksRows.map((row) => (
                <div key={row.id}>
                    <input
                        className="border-2"
                        type="url"
                        id="links"
                        name="links"
                        value={linksRows[row.id].link}
                        onChange={({target}) => onLinkChange(row.id, target.value)}
                    /><br/>
                    <button onClick={() => handleDeleteLink(row.id)}>Delete</button>
                    <br/>
                </div>
            ))}
            <button onClick={handleAddLink}>Add Link</button>
            <br/>
            <label htmlFor="projects">Projects:</label><br/>
            {projects.map((project) => (
                <div key={project.id}>
                    <label htmlFor="project-photo">Project photo:</label><br/>
                    <input
                        className="border-2"
                        type="file"
                        id="project-photo"
                        name="project-photo"
                        onChange={({target}) => {
                            if (target.files) {
                                const file = target.files[0];
                                handleEditProjectPhoto(project.id, file, URL.createObjectURL(file));
                            }
                        }}/><br/>
                    <div
                        className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                        {project.photoPath ? (
                            <img src={project.photoPath} alt=""/>
                        ) : (
                            <span>Select Image</span>
                        )}
                    </div>
                    <label htmlFor="project-name">Project name:</label><br/>
                    <input
                        className="border-2"
                        type="text"
                        id="project-name"
                        name="project-name"
                        value={project.name}
                        onChange={({target}) => handleEditProjectName(project.id, target.value)}/><br/>
                    <label htmlFor="project-name">Description:</label><br/>
                    <input
                        className="border-2"
                        type="text"
                        id="description"
                        name="description"
                        value={project.description}
                        onChange={({target}) => handleEditProjectDescription(project.id, target.value)}/><br/>
                    <label htmlFor="project-link">Project link:</label><br/>
                    <input
                        className="border-2"
                        type="text"
                        id="project-link"
                        name="project-link"
                        value={project.link}
                        onChange={({target}) => handleEditProjectLink(project.id, target.value)}/><br/>
                    <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                </div>
            ))}
            <button onClick={handleAddProject}>Add Project</button>
            <br/>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}
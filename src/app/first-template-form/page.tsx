"use client"

import {useState} from "react";

interface Row {
    id: number;
}

interface ProjectData {
    photo: File | null;
    name: string;
    link: string;
    photoPath: string;
}

interface FirstTemplateData{
    photo: File | null;
    username: string;
    fullname: string;
    location: string;
    role: string;
    bio: string;
    links: string[];
    projects: ProjectData[];
}

export default function FirstTemplateForm(){
    const [linksRows, setLinksRows] = useState<Row[]>([]);
    const [photo, setPhoto] = useState<File>();
    const [photoPath, setPhotoPath] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [fullname, setFullname] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [links, setLinks] = useState<string[]>([]);
    const [projects, setProjects] = useState<ProjectData[]>([]);

    const handleAddLink = () => {
        setLinksRows([...linksRows, {id: linksRows.length}]);
    }

    const onLinkChange = (index: number, value: string) => {
        setLinks(links.map((link, i) => i === index ? value : link));
    }

    const handleDeleteLink = (id: number) => {
        setLinksRows(linksRows.filter((row) => row.id !== id));
        setLinks(links.filter((link, index) => index !== id));
    }

    const handleAddProject = () => {
        setProjects([...projects, {photo: null, name: "", link: "", photoPath: ""}]);
    }

    const handleEditProjectPhoto = (index: number, photo: File, photoPath: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, photo, photoPath} : project));
    }

    const handleEditProjectName = (index: number, name: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, name} : project));
    }

    const handleEditProjectLink = (index: number, link: string) => {
        setProjects(projects.map((project, i) => i === index ? {...project, link} : project));
    }

    const handleDeleteProject = (index: number) => {
        setProjects(projects.filter((project, i) => i !== index));
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
            <label htmlFor="username">Username:</label><br/>
            <input
                className="border-2"
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={({target}) => setUsername(target.value)}/><br/>
            <label htmlFor="fullname">Full name:</label><br/>
            <input
                className="border-2"
                type="text"
                id="fullname"
                name="fullname"
                value={fullname}
                onChange={({target}) => setFullname(target.value)}/><br/>
            <label htmlFor="location">Location:</label><br/>
            <input
                className="border-2"
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={({target}) => setLocation(target.value)}/><br/>
            <label htmlFor="role">Role:</label><br/>
            <input
                className="border-2"
                type="text"
                id="role"
                name="role"
                value={role}
                onChange={({target}) => setRole(target.value)}/><br/>
            <label htmlFor="bio">Bio:</label><br/>
            <textarea
                className="border-2"
                id="bio"
                name="bio"
                value={bio}
                onChange={({target}) => setBio(target.value)}></textarea><br/>
            <label htmlFor="links">Links:</label><br/>
            {linksRows.map((row) => (
                <div key={row.id}>
                    <input
                        className="border-2"
                        type="text"
                        id="links"
                        name="links"
                        value={links[row.id]}
                        onChange={({target}) => onLinkChange(row.id, target.value)}
                    /><br/>
                    <button onClick={() => handleDeleteLink(row.id)}>Delete</button>
                    <br/>
                </div>
            ))}
            <button onClick={handleAddLink}>Add Link</button>
            <br/>
            <label htmlFor="projects">My works:</label><br/>
            {projects.map((project, index) => (
                <div key={index}>
                    <label htmlFor="project-photo">Project photo:</label><br/>
                    <input
                        className="border-2"
                        type="file"
                        id="project-photo"
                        name="project-photo"
                        onChange={({target}) => {
                            if (target.files) {
                                const file = target.files[0];
                                handleEditProjectPhoto(index, file, URL.createObjectURL(file));
                            }
                        }}/><br/>
                    <div
                        className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                        { project.photoPath ? (
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
                        onChange={({target}) => handleEditProjectName(index, target.value)}/><br/>
                    <label htmlFor="project-link">Project link:</label><br/>
                    <input
                        className="border-2"
                        type="text"
                        id="project-link"
                        name="project-link"
                        value={project.link}
                        onChange={({target}) => handleEditProjectLink(index, target.value)}/><br/>
                    <button onClick={() => handleDeleteProject(index)}>Delete</button>
                </div>
            ))}
            <button onClick={handleAddProject}>Add Project</button>
        </div>
    );
}
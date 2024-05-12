import {PortfolioData, ProjectData} from "@/model/types";
import {getStorage, ref, uploadBytes} from "@firebase/storage";
import {db} from "@/firebase/firebaseConfig";
import {addDoc, collection} from "@firebase/firestore";
import {getFileHash} from "@/functions/cryptographyUtilities";
import {
    IMAGES_DIRECTORY_NAME,
    LINKS_COLLECTION_NAME,
    PORTFOLIOS_COLLECTION_NAME,
    PROJECTS_COLLECTION_NAME
} from "@/constants";

async function savePortfolioDataForUser(userId: string, data: PortfolioData): Promise<string | undefined> {
    try{
        let photoPath : string = "";
        if (data.photo) {
            photoPath = await addImage(data.photo);
        }
        const docRef = await addDoc(collection(db, PORTFOLIOS_COLLECTION_NAME), {
            userId: userId,
            photoPath: photoPath,
            username: data.username,
            fullName: data.fullName,
            location: data.location,
            role: data.role,
            bio: data.bio,
        });
        await saveLinksListForDocument(docRef.id, data.links);
        await saveProjectsListForDocument(docRef.id, data.projects);
    } catch (error) {
        console.error('Error saving template data for user with id: ' + userId +'\nError: ' + error);
        return;
    }
}

async function saveLinksListForDocument(docId: string, links: string[]): Promise<void> {
    try {
        for (const link of links) {
            await saveLinkForDocument(docId, link);
        }
    } catch (error) {
        console.error('Error saving links for document with id: ' + docId +'\nError: ' + error);
    }
}

async function saveLinkForDocument(docId: string, link: string): Promise<void> {
    try {
        await addDoc(collection(db, PORTFOLIOS_COLLECTION_NAME, docId, LINKS_COLLECTION_NAME), {
            link: link,
        });
    } catch (error) {
        throw error;
    }
}

async function saveProjectsListForDocument(id: string, projects: ProjectData[]) {
    try {
        for (const project of projects) {
            await saveProjectForDocument(id, project);
        }
    } catch (error) {
        console.error('Error saving projects for document with id: ' + id +'\nError: ' + error);
    }
}

async function saveProjectForDocument(docId: string, project: ProjectData): Promise<void> {
    try {
        let photoPath : string = "";
        if (project.photo) {
            photoPath = await addImage(project.photo);
        }
        await addDoc(collection(db, PORTFOLIOS_COLLECTION_NAME, docId, PROJECTS_COLLECTION_NAME), {
            name: project.name,
            link: project.link,
            photoPath: photoPath,
        });
    } catch (error) {
        throw error;
    }
}

async function addImage(image: File): Promise<string> {
    try {
        const storage = getStorage();
        const hash = await getFileHash(image);
        const fileType = image.name.split(".").slice(-1);
        const path = `${IMAGES_DIRECTORY_NAME}/${hash}.${fileType}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, image);
        return path;
    } catch (error) {
        throw error;
    }
}

export {savePortfolioDataForUser};
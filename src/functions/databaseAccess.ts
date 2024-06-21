import {
    PortfolioData as FirstTemplateData,
    PortfolioDataPreview as FirstTemplateDataPreview,
    ProjectDataPreview as FirstTemplateProjectPreview
} from "@/model/firstTemplateTypes";
import {
    PortfolioDataPreview as SecondTemplateDataPreview,
    PortfolioData as SecondTemplateData,
    ProjectData as SecondTemplateProjectData,
    ProjectDataPreview as SecondTemplateProjectPreview
} from "@/model/secondTemplateTypes";
import {getFileHash} from "@/functions/cryptographyUtilities";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {db} from "@/firebase/firebaseConfig";
import {IMAGES_DIRECTORY_NAME, PORTFOLIOS_COLLECTION_NAME,} from "@/constants";
import {TemplateType} from "@/templatesTypes";
import {validateFirstTemplateData, validateSecondTemplateData} from "@/functions/validation";
import {PortfolioStatus} from "@/portfolioStatuses";
import {PortfolioListItemData} from "@/model/portflolioTypes";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query, QueryFieldFilterConstraint,
    updateDoc,
    where
} from '@firebase/firestore';
import {getStatusName} from '@/functions/statusNameUtilities';
import {PortfolioSearchItem} from "@/model/commonTypes";

export async function userHasPortfolios(userId: string): Promise<boolean>{
    try {
        const snapshot = await getDocs(
            query(collection(db, PORTFOLIOS_COLLECTION_NAME), where('userId', '==', userId))
        );
        return snapshot.docs.length > 0;
    } catch (error) {
        console.error('Error fetching portfolios: ', error);
        return false;
    }
}

export async function getAllPortfoliosAsSearchItems(): Promise<PortfolioSearchItem[]> {
    try {
        return await getPortfoliosAsSearchItems([]);
    } catch (error) {
        console.error('Error fetching portfolios: ', error);
        return [];
    }
}

async function getPortfoliosAsSearchItems(constraints: QueryFieldFilterConstraint[]): Promise<PortfolioSearchItem[]> {
    try {
        const snapshot = await getDocs(
            query(
                collection(db,  PORTFOLIOS_COLLECTION_NAME),
                orderBy('createdTimestamp', 'desc'),
                where("status", "==", PortfolioStatus.PUBLISHED),
                ...constraints
            )
        );
        const portfolios: PortfolioSearchItem[] = [];
        for (const doc of snapshot.docs) {
            const docData = doc.data();
            console.log(docData);
            const photoUrl = await getImageUrlByPath(docData.photoPath);
            if (!photoUrl) {
                throw new Error("Could not get image link for path: " + docData.photo);
            }
            const projectsCreationDates: Date[] = [];
            for (const project of docData.projects) {
                projectsCreationDates.push(project.creationDate.toDate());
            }
            portfolios.push({
                photo: photoUrl,
                fullname: docData.fullName,
                role: docData.role,
                projectsCreationDates: projectsCreationDates,
                link: docData.link,
                templateType: docData.templateType === 0 ? TemplateType.FIRST_TEMPLATE : TemplateType.SECOND_TEMPLATE,
            });
        }
        return portfolios;

    } catch (error) {
        console.error('Error fetching portfolios: ', error);
        return [];
    }
}

export async function saveFirstTemplateDataForUser(userId: string, data: FirstTemplateData): Promise<string | undefined> {
    const validationResults = validateFirstTemplateData(data);
    if (!validationResults.isValid) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + validationResults.message);
        return;
    }
    try {
        type FirebaseProjectData = {
            filePath: string;
            name: string;
            link: string,
            creationDate: Date;
        }
        let photoPath: string = "";
        if (data.photo) {
            photoPath = await addImage(data.photo);
        }
        let firebaseProjects: FirebaseProjectData[] = [];
        for (const project of data.projects) {
            let projectPhotoPath: string = "";
            if (project.photo) {
                projectPhotoPath = await addImage(project.photo);
            }
            firebaseProjects.push({
                filePath: projectPhotoPath,
                name: project.name,
                link: project.link,
                creationDate: project.creationDate,
            });
        }
        const docRef = await addDoc(collection(db, PORTFOLIOS_COLLECTION_NAME),
            {
                templateType: TemplateType.FIRST_TEMPLATE,
                userId: userId,
                name: data.name,
                status: data.status,
                link: data.link,
                photoPath: photoPath,
                username: data.username,
                fullName: data.fullName,
                location: data.location,
                role: data.role,
                projects: firebaseProjects,
                bio: data.bio,
                createdTimestamp: Date.now(),
                links: data.links,
            });
        return docRef.id;
    } catch (error) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + error);
        return;
    }
}

export async function updateFirstTemplateDataForUser(userId: string, data: FirstTemplateData, portfolioId: string): Promise<string | undefined> {
    const validationResults = validateFirstTemplateData(data);
    if (!validationResults.isValid) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + validationResults.message);
        return;
    }
    try {
        type FirebaseProjectData = {
            filePath: string;
            name: string;
            link: string;
            creationDate: Date;
        }
        let photoPath: string = "";
        if (data.photo) {
            photoPath = await addImage(data.photo);
        }
        let firebaseProjects: FirebaseProjectData[] = [];
        for (const project of data.projects) {
            let projectPhotoPath: string = "";
            if (project.photo) {
                projectPhotoPath = await addImage(project.photo);
            }
            firebaseProjects.push({
                filePath: projectPhotoPath,
                name: project.name,
                link: project.link,
                creationDate: project.creationDate,
            });
        }
        const docRef = doc(collection(db, PORTFOLIOS_COLLECTION_NAME), portfolioId);
        await updateDoc(docRef,{
            photoPath: photoPath,
            username: data.username,
            fullName: data.fullName,
            location: data.location,
            role: data.role,
            projects: firebaseProjects,
            bio: data.bio,
            links: data.links,
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + error);
        return;
    }
}

export async function getFirstTemplatePortfolioData(portfolioId: string): Promise<FirstTemplateDataPreview | undefined> {
    try {
        const docRef = doc(db, PORTFOLIOS_COLLECTION_NAME, portfolioId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data) {
                const imageLink = await getImageUrlByPath(data.photoPath);
                if (!imageLink) {
                    throw new Error("Could not get image link for path: " + data.photoPath);
                }
                const projects: FirstTemplateProjectPreview[] = [];
                for (const project of data.projects) {
                    const imageUrl = await getImageUrlByPath(project.filePath);
                    if (!imageUrl) {
                        throw new Error("Could not get image link for path: " + project.filePath);
                    }
                    projects.push({
                        name: project.name,
                        link: project.link,
                        photoUrl: imageUrl,
                        creationDate: project.creationDate.toDate(),
                    });
                }
                console.log(data.links);
                return {
                    name: data.name,
                    status: data.status,
                    link: data.link,
                    photoUrl: imageLink,
                    username: data.username,
                    fullName: data.fullName,
                    location: data.location,
                    role: data.role,
                    bio: data.bio,
                    links: data.links || [],
                    projects: projects,
                };
            }
        }
        return;
    } catch (error) {
        console.error('Error getting template data for protfolio with id: ' + portfolioId + '\nError: ' + error);
        return;
    }
}

export async function saveSecondTemplateDataForUser(userId: string, data: SecondTemplateData): Promise<string | undefined> {
    const validationResults = validateSecondTemplateData(data);
    if (!validationResults.isValid) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + validationResults.message);
        return;
    }
    try {
        type FirebaseProjectData = {
            filePath: string;
            name: string;
            description: string;
            link: string;
            creationDate: Date;
        }
        let photoPath: string = "";
        if (data.photo) {
            photoPath = await addImage(data.photo);
        }
        let firebaseProjects: FirebaseProjectData[] = [];
        for (const project of data.projects) {
            let projectPhotoPath: string = "";
            if (project.photo) {
                projectPhotoPath = await addImage(project.photo);
            }
            firebaseProjects.push({
                filePath: projectPhotoPath,
                name: project.name,
                description: project.description,
                link: project.link,
                creationDate: project.creationDate,
            });
        }
        const docRef = await addDoc(collection(db, PORTFOLIOS_COLLECTION_NAME),
            {
                templateType: TemplateType.SECOND_TEMPLATE,
                userId: userId,
                name: data.name,
                status: data.status,
                link: data.link,
                photoPath: photoPath,
                phoneNumber: data.phoneNumber,
                fullName: data.fullName,
                location: data.location,
                role: data.role,
                projects: firebaseProjects,
                bio: data.bio,
                createdTimestamp: Date.now()
            });
        return docRef.id;
    } catch (error) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + error);
        return;
    }
}

export async function updateSecondTemplateDataForUser(userId: string, data: SecondTemplateData, portfolioId: string): Promise<string | undefined> {
    const validationResults = validateSecondTemplateData(data);
    if (!validationResults.isValid) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + validationResults.message);
        return;
    }
    try {
        type FirebaseProjectData = {
            filePath: string;
            name: string;
            link: string;
            description: string;
            creationDate: Date;
        }
        let photoPath: string = "";
        if (data.photo) {
            photoPath = await addImage(data.photo);
        }
        let firebaseProjects: FirebaseProjectData[] = [];
        for (const project of data.projects) {
            let projectPhotoPath: string = "";
            if (project.photo) {
                projectPhotoPath = await addImage(project.photo);
            }
            firebaseProjects.push({
                filePath: projectPhotoPath,
                name: project.name,
                link: project.link,
                description: project.description,
                creationDate: project.creationDate,
            });
        }
        const docRef = doc(collection(db, PORTFOLIOS_COLLECTION_NAME), portfolioId);
        await updateDoc(docRef,{
            photoPath: photoPath,
            phoneNumber: data.phoneNumber,
            fullName: data.fullName,
            location: data.location,
            role: data.role,
            projects: firebaseProjects,
            bio: data.bio,
            links: data.links,
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + error);
        return;
    }
}

export async function getSecondTemplatePortfolioData(portfolioId: string): Promise<SecondTemplateDataPreview | undefined>{
    try {
        const docRef = doc(db, PORTFOLIOS_COLLECTION_NAME, portfolioId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data) {
                const imageLink = await getImageUrlByPath(data.photoPath);
                if (!imageLink) {
                    throw new Error("Could not get image link for path: " + data.photoPath);
                }
                const projects: SecondTemplateProjectPreview[] = [];
                for (const project of data.projects) {
                    const imageUrl = await getImageUrlByPath(project.filePath);
                    if (!imageUrl) {
                        throw new Error("Could not get image link for path: " + project.filePath);
                    }
                    projects.push({
                        name: project.name,
                        link: project.link,
                        photoUrl: imageUrl,
                        description: project.description,
                        creationDate: project.creationDate.toDate(),
                    });
                }
                console.log(data.links);
                return {
                    name: data.name,
                    status: data.status,
                    link: data.link,
                    photoUrl: imageLink,
                    phoneNumber: data.phoneNumber,
                    fullName: data.fullName,
                    location: data.location,
                    role: data.role,
                    bio: data.bio,
                    links: data.links || [],
                    projects: projects,
                };
            }
        }
        return;
    } catch (error) {
        console.error('Error getting template data for protfolio with id: ' + portfolioId + '\nError: ' + error);
        return;
    }
}

export async function publishPortfolio(portfolioId: string): Promise<string> {
    try {
        const docRef = doc(db, PORTFOLIOS_COLLECTION_NAME, portfolioId);
        const templateType = (await getDoc(docRef)).data()?.templateType;
        const docId = docRef.id;
        let pageName = "";
        if (templateType === TemplateType.FIRST_TEMPLATE) {
            pageName = "first-template-published";
        } else if (templateType === TemplateType.SECOND_TEMPLATE) {
            pageName = "second-template-published";
        }
        const link = "/" + pageName + "/" + docId;
        await updateDoc(docRef, {status: PortfolioStatus.PUBLISHED, link: link});
        return link;
    }
    catch(error){
        console.error('Error publishing portfolio with id: ' + portfolioId + '\nError: ' + error);
        return "";
    }
}


export async function downloadImage(url: string) : Promise<File | undefined> {
    try{
        const extension = url.split("?")[0].split(".").at(-1);
        const fileName = url.split("%")[1].split(".")[0];
        const response = await fetch(url);
        const blob = await response.blob();
        if (extension){
            return new File([blob], fileName + "." + extension, {type: "image/" + extension});
        }
    }
    catch(error){
        console.error('Error loading file with path: ' + url + '\nError: ' + error);
        return;
    }
}

export async function fetchPortfoliosAsListItems(userId: string): Promise<PortfolioListItemData[]> {
    try {
        const snapshot = await getDocs(
            query(collection(db, PORTFOLIOS_COLLECTION_NAME), where('userId', '==', userId))
        );
        const portfolioData: PortfolioListItemData[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            imageUrl: doc.data().photoPath,
            status: getStatusName(doc.data().status),
            link: doc.data().link,
            templateType: doc.data().templateType,
        }));
        return portfolioData;
    } catch (error) {
        console.error('Error fetching portfolios: ', error);
        return [];
    }
}


export async function deletePortfolio(portfolioId: string): Promise<string | undefined>{
    try {
        const portfolioRef = doc(db, "portfolios", portfolioId);
        await deleteDoc(portfolioRef);
    } catch (error) {
        console.error('Error deleting portfolio: ', error);
        return "hui";
    }
}

export async function editPortfolioName(portfolioName: string, portfolioId: string): Promise<string | undefined>{
    try {
        const portfolioRef = doc(db, "portfolios", portfolioId);
        await updateDoc(portfolioRef, {
            name: portfolioName
        });
    } catch (error) {
        console.error('Error updating portfolio name: ', error);
        return;
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


async function getImageUrlByPath(path: string): Promise<string | undefined> {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    try {
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.log("Could not download an image for path: " + path + "\nError: " + error);
    }
}


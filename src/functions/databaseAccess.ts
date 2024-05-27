import {PortfolioData as SecondTemplateData, ProjectData as SecondTemplateProjectData} from "@/model/secondTemplateTypes";
import {PortfolioData as FirstTemplateData, ProjectData as FirstTemplateProjectData} from "@/model/firstTemplateTypes";
import {getStorage, ref, uploadBytes} from "@firebase/storage";
import {db} from "@/firebase/firebaseConfig";
import {getFileHash} from "@/functions/cryptographyUtilities";
import {
    IMAGES_DIRECTORY_NAME,
    PORTFOLIOS_COLLECTION_NAME,
} from "@/constants";
import {TemplateType} from "@/templatesTypes";
import { PortfolioListItemData } from "@/model/portflolioTypes";
import { addDoc, getDocs, collection, doc, deleteDoc, updateDoc, query, where } from '@firebase/firestore';
import { getStatusName } from '@/functions/statusNameUtilities';


async function saveFirstTemplateDataForUser(userId: string, data: FirstTemplateData): Promise<string | undefined> {
    try {
        type FirebaseProjectData = {
            filePath: string;
            name: string;
            link: string;
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
            });
        return docRef.id;
    } catch (error) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + error);
        return;
    }
}

async function saveSecondTemplateDataForUser(userId: string, data: SecondTemplateData): Promise<string | undefined> {
    try {
        type FirebaseProjectData = {
            filePath: string;
            name: string;
            description: string;
            link: string;
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
            });
        return docRef.id;
    } catch (error) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + error);
        return;
    }
}

async function fetchPortfolios(userId: string): Promise<PortfolioListItemData[]> {
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


  async function deletePortfolio(portfolioId: string): Promise<string | undefined>{
    try {
        const portfolioRef = doc(db, "portfolios", portfolioId);
        await deleteDoc(portfolioRef);
    } catch (error) {
        console.error('Error deleting portfolio: ', error);
        return "hui";
    }
  }

  async function editPortfolioName(portfolioName: string, portfolioId: string): Promise<string | undefined>{
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

export {saveFirstTemplateDataForUser, saveSecondTemplateDataForUser, fetchPortfolios, deletePortfolio, editPortfolioName};
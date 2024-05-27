import {PortfolioData as FirstTemplateData, ProjectData as FirstTemplateProjectData, PortfolioDataPreview as FirstTemplateDataPreview,
  ProjectDataPreview as FirstTemplateProjectPreview} from "@/model/firstTemplateTypes";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {
  PortfolioData as SecondTemplateData,
  ProjectData as SecondTemplateProjectData
} from "@/model/secondTemplateTypes";
import {db} from "@/firebase/firebaseConfig";
import {addDoc, collection, doc, getDoc, query, getDocs, updateDoc} from "@firebase/firestore";
import {getFileHash} from "@/functions/cryptographyUtilities";
import {
  IMAGES_DIRECTORY_NAME,
  PORTFOLIOS_COLLECTION_NAME,
} from "@/constants";
import {TemplateType} from "@/templatesTypes";
import {validateFirstTemplateData} from "@/functions/validation";


async function saveFirstTemplateDataForUser(userId: string, data: FirstTemplateData): Promise<string | undefined> {
    const validationResults = validateFirstTemplateData(data);
    if (!validationResults.isValid) {
        console.error('Error saving template data for user with id: ' + userId + '\nError: ' + validationResults.message);
        return;
    }
    try {
      type FirebaseProjectData = {
        filePath: string;
        name: string;
        link: string
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
        const docRef = doc(collection(db, PORTFOLIOS_COLLECTION_NAME), portfolioId);
        await updateDoc(docRef,{
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
            photoPath: imageUrl,
          });
        }
        return {
          name: data.name,
          status: data.status,
          link: data.link,
          photoPath: imageLink,
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

import {PortfolioData, PortfolioDataPreview, ProjectData, ProjectDataPreview} from "@/model/types";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {db} from "@/firebase/firebaseConfig";
import {addDoc, collection, doc, getDoc, query, getDocs} from "@firebase/firestore";
import {getFileHash} from "@/functions/cryptographyUtilities";
import {
  IMAGES_DIRECTORY_NAME,
  LINKS_COLLECTION_NAME,
  PORTFOLIOS_COLLECTION_NAME,
  PROJECTS_COLLECTION_NAME
} from "@/constants";


export async function getPortfolioDataForUser(portfolioId: string): Promise<PortfolioDataPreview | undefined> {
  try {
    const docRef = doc(db, PORTFOLIOS_COLLECTION_NAME, portfolioId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data) {
        const links = await getLinksListForDocument(docSnap.id);
        const projects = await getProjectsListForDocument(docSnap.id);
        const imageLink = await getImageUrlByPath(data.photoPath);
        if (!imageLink) {
          throw new Error("Could not get image link for path: " + data.photoPath);
        }
        return {
          photoPath: imageLink,
          username: data.username,
          fullName: data.fullName,
          location: data.location,
          role: data.role,
          bio: data.bio,
          links: links,
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

export async function savePortfolioDataForUser(userId: string, data: PortfolioData): Promise<string | undefined> {
  try {
    let photoPath: string = "";
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
    console.error('Error saving template data for user with id: ' + userId + '\nError: ' + error);
    return;
  }
}

async function saveLinksListForDocument(docId: string, links: string[]): Promise<void> {
  try {
    for (const link of links) {
      await saveLinkForDocument(docId, link);
    }
  } catch (error) {
    console.error('Error saving links for document with id: ' + docId + '\nError: ' + error);
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
    console.error('Error saving projects for document with id: ' + id + '\nError: ' + error);
  }
}

async function saveProjectForDocument(docId: string, project: ProjectData): Promise<void> {
  try {
    let photoPath: string = "";
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

async function getLinksListForDocument(docId: string): Promise<string[]> {
  try {
    const links: string[] = [];
    const querySnapshot = await getDocs(query(collection(db, PORTFOLIOS_COLLECTION_NAME, docId, LINKS_COLLECTION_NAME)));
    querySnapshot.forEach((doc) => {
      links.push(doc.data().link);
    });
    return links;
  } catch (error) {
    console.error('Error getting links for document with id: ' + docId + '\nError: ' + error);
    return [];
  }
}


async function getProjectsListForDocument(docId: string): Promise<ProjectDataPreview[]> {
  try {
    const projects: ProjectDataPreview[] = [];
    const querySnapshot = await getDocs(query(collection(db, PORTFOLIOS_COLLECTION_NAME, docId, PROJECTS_COLLECTION_NAME)));
    for (const doc of querySnapshot.docs) {
      const imageLink = await getImageUrlByPath(doc.data().photoPath) || "";
      projects.push({
        photoPath: imageLink,
        name: doc.data().name,
        link: doc.data().link,
      });
    }
    // querySnapshot.forEach((doc) => {
    //   const imageLink = await getImageUrlByPath(doc.data().photoPath);
    //   projects.push({
    //     photoPath: doc.data().photoPath,
    //     name: doc.data().name,
    //     link: doc.data().link,
    //   });
    // });
    return projects;
  } catch (error) {
    console.error('Error getting projects for document with id: ' + docId + '\nError: ' + error);
    return [];
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
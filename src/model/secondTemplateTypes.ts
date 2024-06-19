import {PortfolioStatus} from "@/portfolioStatuses";

type ProjectData = {
    photo: File | null;
    name: string;
    description: string;
    link: string;
}

type PortfolioData = {
    name: string;
    status: PortfolioStatus.DRAFT;
    link: string;
    photo: File | null;
    phoneNumber: string;
    fullName: string;
    location: string;
    role: string;
    bio: string;
    links: string[];
    projects: ProjectData[];
}


export type ProjectDataPreview = {
    photoUrl: string;
    name: string;
    description: string;
    link: string;
}

export type PortfolioDataPreview = {
    name: string;
    status: PortfolioStatus.DRAFT;
    link: string;
    photoUrl: string;
    fullName: string;
    location: string;
    role: string;
    bio: string;
    links: string[];
    projects: ProjectDataPreview[];
}

//GeneralData
export type {PortfolioData, ProjectData}
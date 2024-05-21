import {PortfolioStatus} from "@/portfolioStatuses";

export interface ProjectData {
    photo: File | null;
    name: string;
    link: string;
}

export interface PortfolioData {
    name: string;
    status: PortfolioStatus.DRAFT;
    link: string;
    photo: File | null;
    username: string;
    fullName: string;
    location: string;
    role: string;
    bio: string;
    links: string[];
    projects: ProjectData[];
}


export type ProjectDataPreview = {
    photoPath: string;
    name: string;
    link: string;
}

export type PortfolioDataPreview = {
    photoPath: string;
    username: string;
    fullName: string;
    location: string;
    role: string;
    bio: string;
    links: string[];
    projects: ProjectDataPreview[];
}

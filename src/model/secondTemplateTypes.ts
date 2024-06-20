import {PortfolioStatus} from "@/portfolioStatuses";

export type ProjectData = {
    photo: File | null;
    name: string;
    description: string;
    link: string;
    creationDate: Date;
}

export type PortfolioData = {
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
    link: string;
    description: string;
    creationDate: Date;
}

export type PortfolioDataPreview = {
    name: string;
    status: PortfolioStatus.DRAFT;
    link: string;
    photoUrl: string;
    phoneNumber: string;
    fullName: string;
    location: string;
    role: string;
    bio: string;
    links: string[];
    projects: ProjectDataPreview[];
}

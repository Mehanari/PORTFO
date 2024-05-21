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

//GeneralData
export type {PortfolioData, ProjectData}
import {PortfolioStatus} from "@/portfolioStatuses";

interface ProjectData {
    photo: File | null;
    name: string;
    link: string;
}

interface PortfolioData {
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

//GeneralData
export type {PortfolioData, ProjectData}
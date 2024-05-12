interface ProjectData {
    photo: File | null;
    name: string;
    link: string;
}

interface PortfolioData {
    photo: File | null;
    username: string;
    fullName: string;
    location: string;
    role: string;
    bio: string;
    links: string[];
    projects: ProjectData[];
}

export type {PortfolioData, ProjectData}
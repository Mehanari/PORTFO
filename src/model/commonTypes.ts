import {TemplateType} from "@/templatesTypes";

export type PortfolioSearchItem = {
    photo: string, 
    fullname: string, 
    role: string, 
    projectsCreationDates: Date[],
    link: string,
    templateType: TemplateType
}
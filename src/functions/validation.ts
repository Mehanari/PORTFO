import {PortfolioData as FirstTemplateData, ProjectData as FirstTemplateProjectData} from "@/model/firstTemplateTypes";

export type ValidationResult = {
    isValid: boolean;
    message: string;
}

export function validateFirstTemplateData(data: FirstTemplateData): ValidationResult {
    if (!data.username) {
        return {
            isValid: false,
            message: "Cannot save portfolio data. Username is required!"
        }
    }
    if (!data.fullName) {
        return {
            isValid: false,
            message: "Cannot save portfolio data. Full name is required!"
        }
    }
    if (!data.photo) {
        return {
            isValid: false,
            message: "Cannot save portfolio data. Photo is required!"
        }
    }
    if (!data.location) {
        return {
            isValid: false,
            message: "Cannot save portfolio data. Location is required!"
        }
    }
    if (!data.role) {
        return {
            isValid: false,
            message: "Cannot save portfolio data. Role is required!"
        }
    }
    if (!data.bio) {
        return {
            isValid: false,
            message: "Cannot save portfolio data. Bio is required!"
        }
    }
    for (const link of data.links) {
        if (!urlIsValid(link)) {
            return {
                isValid: false,
                message: "Cannot save portfolio data. Link number " + (data.links.indexOf(link) + 1) + " is not a valid URL!"
            }
        }
    }
    for (const project of data.projects) {
        const projectDataValidationResult = firstTemplateProjectDataIsValid(project);
        if (!projectDataValidationResult.isValid) {
            return projectDataValidationResult;
        }
    }
    return {
        isValid: true,
        message: ""
    }
}

export function firstTemplateProjectDataIsValid(project: FirstTemplateProjectData): ValidationResult {
    if (!project.name) {
        return {
            isValid: false,
            message: "Cannot save project data. Project name is required!"
        }
    }
    if (!project.link) {
        return {
            isValid: false,
            message: "Cannot save project data. Project link is required!"
        }
    }
    if (!urlIsValid(project.link)) {
        return {
            isValid: false,
            message: "Cannot save project data. Project link is not a valid URL!"
        }
    }
    return {
        isValid: true,
        message: ""
    }

}

export function urlIsValid(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
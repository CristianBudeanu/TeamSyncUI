import { GithubRepository } from "../github";
import { TaskItemDto } from "../task";

export interface Project{
    id: string;
    name: string;
    image: string;
    category: string;
    description: string;
    status: string;
    completed: number;
    members: Member[];
    userRoles: string[];
    githubRepository: GithubRepository

};

export interface ProjectCreate{
    image: File;
    name: string;
    category:string;
    description: string;
}

export interface Member{
    id: string;
    username: string;
    role: string;
    assignedTasks : TaskItemDto[]
}


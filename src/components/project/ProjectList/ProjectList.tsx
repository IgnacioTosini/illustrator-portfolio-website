'use client'

import ProjectCard from '../ProjectCard/ProjectCard'
import { Project } from '@/types';
import { useLanguage } from "@/providers/LanguageProvider";
import './_projectList.scss'

interface Props {
    projects: Project[];
    selectedClientParam?: string | null;
    selectedPageParam?: number;
    priorityImages?: boolean;
}

export const ProjectList = ({ projects, selectedClientParam = null, selectedPageParam = 1, priorityImages = false }: Props) => {
    const { t } = useLanguage();

    if (projects.length === 0) {
        return (
            <div className="projectsContainer">
                <p className="emptyProjects">{t("works.emptyProjects")}</p>
            </div>
        );
    }

    return (
        <div className="projectsContainer">
            {projects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    selectedClientParam={selectedClientParam}
                    selectedPageParam={selectedPageParam}
                    priority={priorityImages && index < 2}
                    featuredLayout={index === 0}
                />
            ))}
        </div>
    );
};

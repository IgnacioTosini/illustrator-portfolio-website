'use client'

import ProjectCard from '../ProjectCard/ProjectCard'
import ProjectCardSkeleton from '../ProjectCard/ProjectCardSkeleton'
import { Project } from '@/types';
import { useProjectsQuery } from '../../../hooks/project/useProjectsQuery';
import './_projectList.scss'

interface Props {
    projects: Project[];
}

export const ProjectList = ({ projects }: Props) => {
    const { isLoading } = useProjectsQuery();
    const skeletons = Array.from({ length: 3 });

    if (isLoading) {
        return (
            <div className="projectsContainer">
                {skeletons.map((_, index) => (
                    <ProjectCardSkeleton key={`project-skeleton-${index}`} />
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="projectsContainer">
                <p className="emptyProjects">No hay proyectos para mostrar por ahora.</p>
            </div>
        );
    }

    return (
        <div className="projectsContainer">
            {projects.map((project, index) => (
                <ProjectCard key={project.slug + index} project={project} />
            ))}
        </div>
    );
};
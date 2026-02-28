'use client'

import ProjectCard from '../ProjectCard/ProjectCard'
import { Project } from '@/types';
import './_projectList.scss'

interface Props {
    projects: Project[];
    selectedClientParam?: string | null;
}

export const ProjectList = ({ projects, selectedClientParam = null }: Props) => {
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
                <ProjectCard
                    key={project.slug + index}
                    project={project}
                    selectedClientParam={selectedClientParam}
                />
            ))}
        </div>
    );
};
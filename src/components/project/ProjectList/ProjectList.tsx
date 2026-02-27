'use client'

import ProjectCard from '../ProjectCard/ProjectCard'
import { Project } from '@/types';
import './_projectList.scss'

interface Props {
    projects: Project[];
}

export const ProjectList = ({ projects }: Props) => {
    return (
        <div className="projectsContainer">
            {projects.map((project, index) => (
                <ProjectCard key={project.slug + index} project={project} />
            ))}
        </div>
    );
};
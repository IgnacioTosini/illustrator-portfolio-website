'use client'

import AdminProjectCard from '../AdminProjectCard/AdminProjectCard'
import { useProjectsQuery } from '@/hooks/project/useProjectsQuery';
import { Project } from '@/types';
import './_adminProjectList.scss'

export const AdminProjectList = () => {
    const { data: projects, isLoading, isError, error } = useProjectsQuery();

    if (isLoading) return <p>Cargando proyectos...</p>;
    if (isError) return <p>{(error as Error).message}</p>;
    if (!projects?.length) return <p>No hay proyectos.</p>;
    return (
        <div className="projectsContainer">
            {projects.map((project: Project, index: number) => (
                <AdminProjectCard key={`${project.slug}-${index}`} project={project} />
            ))}
        </div>
    );
};
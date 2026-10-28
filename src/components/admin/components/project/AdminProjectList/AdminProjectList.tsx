'use client';

import { useEffect, useState } from 'react';
import AdminProjectCard from '../AdminProjectCard/AdminProjectCard';
import { useProjectsQuery } from '@/hooks/project/useProjectsQuery';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { ADMIN_PROJECTS_PAGE_SIZE } from '@/lib/pagination';
import './_adminProjectList.scss';

export const AdminProjectList = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    useEffect(() => {
        const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
        return () => window.clearTimeout(timeout);
    }, [search]);
    const { data, isLoading, isError, error } = useProjectsQuery(page, debouncedSearch);
    const projects = data?.projects ?? [];
    const totalItems = data?.totalItems ?? 0;
    const currentPage = data?.currentPage ?? page;

    return (
        <section className="projectLibrary" aria-label="Biblioteca de proyectos">
            <div className="projectLibraryToolbar">
                <div>
                    <p className="projectLibraryCount">
                        {isLoading ? 'Cargando proyectos…' : `${totalItems} ${totalItems === 1 ? 'proyecto' : 'proyectos'}`}
                    </p>
                    <p className="projectLibraryHint">Busca por título, cliente o categoría.</p>
                </div>
                <label className="projectSearchWrap">
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        placeholder="Buscar proyectos"
                        aria-label="Buscar proyectos por título, cliente o categoría"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setPage(1);
                        }}
                    />
                </label>
            </div>

            {isError ? (
                <p className="projectLibraryState">No se pudieron cargar los proyectos: {(error as Error).message}</p>
            ) : isLoading ? (
                <p className="projectLibraryState">Preparando tu biblioteca…</p>
            ) : projects.length ? (
                <>
                    <div className="projectsContainer">
                        {projects.map((project) => (
                            <AdminProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        pageSize={ADMIN_PROJECTS_PAGE_SIZE}
                        onPageChange={setPage}
                        labels={{ navigation: 'Paginación de proyectos', page: (number) => `Página ${number}` }}
                    />
                </>
            ) : (
                <div className="projectLibraryState">
                    <strong>{search.trim() ? 'No encontramos coincidencias.' : 'Todavía no hay proyectos.'}</strong>
                    <span>{search.trim() ? 'Prueba con otro título, cliente o categoría.' : 'Crea tu primer proyecto para empezar a organizar el portfolio.'}</span>
                </div>
            )}
        </section>
    );
};

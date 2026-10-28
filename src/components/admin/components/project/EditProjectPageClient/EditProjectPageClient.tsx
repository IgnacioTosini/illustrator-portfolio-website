'use client';

import { ProjectForm } from "@/components/admin/components/ui/ProjectForm/ProjectForm";
import { useProjectBySlugQuery } from "@/hooks/project/useProjectBySlugQuery";
import { useCategoriesQuery } from "@/hooks/category/useCategoriesQuery";
import { useClientsQuery } from "@/hooks/client/useClientsQuery";
import Link from "next/link";

interface Props {
    slug: string;
}

export default function EditProjectPageClient({ slug }: Props) {
    const {
        data: project,
        isLoading: loadingProject,
        isError: errorProject,
        error: projectError,
    } = useProjectBySlugQuery(slug);

    const {
        data: categories = [],
        isLoading: loadingCategories,
        isError: errorCategories,
        error: categoriesError,
    } = useCategoriesQuery();

    const {
        data: clients = [],
        isLoading: loadingClients,
        isError: errorClients,
        error: clientsError,
    } = useClientsQuery();

    if (loadingProject || loadingCategories || loadingClients) {
        return <div className="projectFormState" role="status"><span className="loadingMark" aria-hidden="true" />Cargando datos del proyecto…</div>;
    }

    if (errorProject || errorCategories || errorClients) {
        const message =
            (projectError as Error)?.message ||
            (categoriesError as Error)?.message ||
            (clientsError as Error)?.message ||
            "Error al cargar datos";
        return <div className="projectFormState projectFormState--error" role="alert">{message}</div>;
    }

    if (!project) {
        return <div className="projectFormState">No encontramos ese proyecto. <Link href="/dashboard/projects">Volver a proyectos</Link></div>;
    }

    const projectFormValues = {
        slug: project.slug,
        title: project.title,
        description: project.description,
        year: project.year ?? new Date().getFullYear(),
        featured: project.featured ?? false,
        categoryId: project.categoryId ?? "",
        clientId: project.clientId ?? "",
        newCategoryName: "",
        newClientName: "",
    };

    return (
        <ProjectForm
            project={projectFormValues}
            categories={categories}
            clients={clients}
            mode="edit"
            projectId={project.id}
            initialImages={project.images}
        />
    );
}

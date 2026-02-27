'use client';

import { ProjectForm } from "@/components/admin/components/ui/ProjectForm/ProjectForm";
import { useProjectBySlugQuery } from "@/hooks/project/useProjectBySlugQuery";
import { useCategoriesQuery } from "@/hooks/category/useCategoriesQuery";
import { useClientsQuery } from "@/hooks/client/useClientsQuery";

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
        return <p>Cargando datos...</p>;
    }

    if (errorProject || errorCategories || errorClients) {
        const message =
            (projectError as Error)?.message ||
            (categoriesError as Error)?.message ||
            (clientsError as Error)?.message ||
            "Error al cargar datos";
        return <p>{message}</p>;
    }

    if (!project) {
        return <div>Proyecto no encontrado</div>;
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
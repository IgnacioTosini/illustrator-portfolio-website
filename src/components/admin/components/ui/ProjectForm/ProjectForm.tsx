'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Category, Client } from "@/types";
import { projectFormSchema } from "@/utils/schemas/projectSchema";
import * as yup from "yup";
import Image from "next/image";
import { useCreateProjectMutation } from "@/hooks/project/useCreateProjectMutation";
import { useUpdateProjectMutation } from "@/hooks/project/useUpdateProjectMutation";
import { useCategoriesQuery } from "@/hooks/category/useCategoriesQuery";
import { useClientsQuery } from "@/hooks/client/useClientsQuery";
import './_projectForm.scss';

type ProjectFormData = yup.Asserts<typeof projectFormSchema>;

type ExistingImage = {
    id: string;
    url: string;
    alt?: string | undefined;
    order: number;
};

interface ProjectFormProps {
    categories: Category[]
    clients: Client[]
    mode?: "create" | "edit";
    projectId?: string;
    project?: ProjectFormData;
    initialImages?: ExistingImage[];
}

export const ProjectForm = ({ categories, clients, mode = "create", projectId, project, initialImages = [] }: ProjectFormProps) => {
    const router = useRouter();
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [existingImages] = useState<ExistingImage[]>(initialImages);
    const [removedExistingIds, setRemovedExistingIds] = useState<string[]>([]);
    const { data: categoriesData = categories } = useCategoriesQuery(categories);
    const { data: clientsData = clients } = useClientsQuery(clients);
    const createMutation = useCreateProjectMutation();
    const updateMutation = useUpdateProjectMutation();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(projectFormSchema),
        defaultValues: {
            title: project?.title || "",
            slug: project?.slug || "",
            description: project?.description || "",
            year: project?.year ?? new Date().getFullYear(),
            featured: project?.featured ?? false,
            categoryId: project?.categoryId || "",
            clientId: project?.clientId || "",
            newCategoryName: "",
            newClientName: "",
            images: undefined as FileList | undefined,
        }
    });

    useEffect(() => {
        return () => {
            previewUrls
                .filter((url) => url.startsWith("blob:"))
                .forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
        reader.readAsDataURL(file);
    });

    const onSubmit = async (data: ProjectFormData) => {
        try {
            const files = data.images ? Array.from(data.images) : [];
            const imagePayload = await Promise.all(
                files.map(async (file, index) => ({
                    id: crypto.randomUUID(),
                    url: await fileToDataUrl(file),
                    alt: file.name,
                    order: index,
                }))
            );

            const projectData = { ...data, images: imagePayload };

            if (mode === "edit") {
                await updateMutation.mutateAsync({
                    id: projectId!,
                    slug: project?.slug,
                    payload: {
                        ...projectData,
                        keptExistingImageIds: visibleExistingImages.map((i) => i.id),
                    },
                });
            } else {
                await createMutation.mutateAsync(projectData as Record<string, unknown>);
            }

            router.push('/dashboard/projects');
        } catch (error) {
            console.error('Error al guardar proyecto:', error);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;


    const removeExistingImage = (id: string) => {
        setRemovedExistingIds((prev) => [...prev, id]);
    };

    const visibleExistingImages = existingImages.filter(
        (img) => !removedExistingIds.includes(img.id)
    );

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data as ProjectFormData))} className="projectForm">
            <div className="field">
                <label>Título</label>
                <input {...register('title')} type="text" />
                {errors.title && <span className="error">{errors.title.message}</span>}
            </div>

            <div className="field">
                <label>Slug</label>
                <input {...register('slug')} type="text" />
                {errors.slug && <span className="error">{errors.slug.message}</span>}
            </div>

            <div className="field field--full">
                <label>Descripción</label>
                <textarea {...register('description')} />
                {errors.description && <span className="error">{errors.description.message}</span>}
            </div>

            <div className="field">
                <label>Año</label>
                <input {...register('year', { valueAsNumber: true })} type="number" />
                {errors.year && <span className="error">{errors.year.message}</span>}
            </div>

            <div className="field field--checkbox">
                <label className="checkLabel">
                    <input {...register('featured')} type="checkbox" /> Destacado
                </label>
            </div>

            <div className="field">
                <label>Categoría</label>
                <select {...register('categoryId')}>
                    <option value="">Selecciona categoría</option>
                    {categoriesData.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                {errors.categoryId && <span className="error">{errors.categoryId.message}</span>}
                <input
                    {...register('newCategoryName')}
                    type="text"
                    placeholder="O escribe una nueva categoría"
                />
                {errors.newCategoryName && <span className="error">{errors.newCategoryName.message}</span>}
            </div>

            <div className="field">
                <label>Cliente</label>
                <select {...register('clientId')}>
                    <option value="">Selecciona cliente</option>
                    {clientsData.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
                {errors.clientId && <span className="error">{errors.clientId.message}</span>}
                <input
                    {...register('newClientName')}
                    type="text"
                    placeholder="O escribe un nuevo cliente"
                />
                {errors.newClientName && <span className="error">{errors.newClientName.message}</span>}
            </div>

            <div className="field field--full">
                <label>Fotos</label>
                <input
                    type="file"
                    {...register('images', {
                        onChange: (event) => {
                            previewUrls
                                .filter((url) => url.startsWith("blob:"))
                                .forEach((url) => URL.revokeObjectURL(url));

                            const input = event.target as HTMLInputElement;
                            const files = input.files ? Array.from(input.files) : [];
                            const urls = files.map((file) => URL.createObjectURL(file));
                            setPreviewUrls(urls);
                        }
                    })}
                    multiple
                    className="fileInput"
                    accept="image/png, image/jpeg, image/avif"
                />
            </div>

            {mode === "edit" && (
                <div className="field field--full previewGrid">
                    {visibleExistingImages.map((image, index) => (
                        <div key={image.id} className="previewCard">
                            <Image
                                alt={image.alt ?? `Imagen existente ${index + 1}`}
                                src={image.url}
                                width={400}
                                height={240}
                                className="previewImage"
                            />
                            <button type="button" className="removeButton" onClick={() => removeExistingImage(image.id)}>
                                Quitar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="newImagesSection">
                <h3>Vista previa de nuevas imágenes</h3>
                <div className="field field--full previewGrid">
                    {previewUrls.map((url, index) => (
                        <div key={url} className="previewCard">
                            <Image
                                alt={`Vista previa ${index + 1}`}
                                src={url}
                                width={400}
                                height={240}
                                className="previewImage"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="submitRow">
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : mode === "edit" ? "Guardar cambios" : "Crear Proyecto"}
                </button>
                <button type="button" className="cancelButton" onClick={() => router.push('/dashboard/projects')} disabled={isSubmitting}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};
'use client'

import { useEffect, useRef, useState } from "react";
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
import { toast } from 'react-toastify';
import ImageCropEditor from '../ImageCropEditor/ImageCropEditor';
import { deleteUploadedImageUrls, uploadImageFiles } from '@/lib/client/project-images';

type ProjectFormData = yup.Asserts<typeof projectFormSchema>;

type ExistingImage = {
    id: string;
    url: string;
    alt?: string | undefined;
    order: number;
};

type NewImage = { id: string; file: File; previewUrl: string };
type CropTarget =
    | { kind: 'existing'; id: string; src: string; fileName: string }
    | { kind: 'new'; id: string; src: string; fileName: string };

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
    const [newImages, setNewImages] = useState<NewImage[]>([]);
    const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const objectUrlsRef = useRef<string[]>([]);
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

    useEffect(() => () => {
        objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    const createNewImage = (file: File): NewImage => {
        const previewUrl = URL.createObjectURL(file);
        objectUrlsRef.current.push(previewUrl);
        return { id: crypto.randomUUID(), file, previewUrl };
    };

    const onSubmit = async (data: ProjectFormData) => {
        let uploadedUrls: string[] = [];
        setIsUploadingImages(true);
        try {
            const uploadedImageUrls = await uploadImageFiles(newImages.map(({ file }) => file));
            uploadedUrls = uploadedImageUrls;
            const imagePayload = newImages.map(({ file }, index) => ({
                    id: crypto.randomUUID(),
                    url: uploadedImageUrls[index],
                    alt: file.name,
                    order: index,
                }));

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
                toast.success('Proyecto actualizado exitosamente');
            } else {
                await createMutation.mutateAsync(projectData as Record<string, unknown>);
                toast.success('Proyecto creado exitosamente');
            }

            uploadedUrls = [];
            router.push('/dashboard/projects');
        } catch (error) {
            await deleteUploadedImageUrls(uploadedUrls);
            console.error('Error al guardar proyecto:', error);
            toast.error(error instanceof Error ? error.message : 'Error al guardar proyecto');
        } finally {
            setIsUploadingImages(false);
        }
    };

    const openCropEditor = (target: CropTarget) => setCropTarget(target);

    const saveCroppedImage = (file: File) => {
        if (!cropTarget) return;
        const replacement = createNewImage(file);

        if (cropTarget.kind === 'existing') {
            setRemovedExistingIds((previous) => previous.includes(cropTarget.id) ? previous : [...previous, cropTarget.id]);
            setNewImages((previous) => [...previous, replacement]);
        } else {
            setNewImages((previous) => previous.map((image) => {
                if (image.id !== cropTarget.id) return image;
                URL.revokeObjectURL(image.previewUrl);
                return { ...replacement, id: image.id };
            }));
        }

        setCropTarget(null);
    };

    const removeNewImage = (id: string) => {
        setNewImages((previous) => {
            const imageToRemove = previous.find((image) => image.id === id);
            if (imageToRemove) URL.revokeObjectURL(imageToRemove.previewUrl);
            return previous.filter((image) => image.id !== id);
        });
    };

    const isSubmitting = isUploadingImages || createMutation.isPending || updateMutation.isPending;

    const removeExistingImage = (id: string) => {
        setRemovedExistingIds((prev) => [...prev, id]);
    };

    const visibleExistingImages = existingImages.filter(
        (img) => !removedExistingIds.includes(img.id)
    );

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data as ProjectFormData))} className="projectForm">
            <header className="projectFormHeader">
                <div>
                    <span className="formEyebrow">{mode === 'edit' ? 'EDICIÓN DE PROYECTO' : 'NUEVO CONTENIDO'}</span>
                    <h1>{mode === 'edit' ? 'Editar proyecto' : 'Crear proyecto'}</h1>
                    <p>{mode === 'edit' ? 'Actualiza los datos y las imágenes de esta pieza.' : 'Completa los datos para sumar una pieza al portfolio.'}</p>
                </div>
                {mode === 'edit' && <span className="editingProjectName">{project?.title}</span>}
            </header>
            <section className="formSection">
                <div className="formSectionHeading"><span>01</span><div><h2>Contenido</h2><p>Título, enlace y descripción que verá quien visite el portfolio.</p></div></div>
                <div className="formSectionGrid">
            <div className="field">
                <label htmlFor="project-title">Título</label>
                <input id="project-title" {...register('title')} type="text" aria-invalid={Boolean(errors.title)} />
                {errors.title && <span className="error" role="alert">{errors.title.message}</span>}
            </div>

            <div className="field">
                <label htmlFor="project-slug">URL / slug</label>
                <input id="project-slug" {...register('slug')} type="text" aria-invalid={Boolean(errors.slug)} />
                <small className="fieldHint">Identificador usado en la dirección del proyecto.</small>
                {errors.slug && <span className="error" role="alert">{errors.slug.message}</span>}
            </div>

            <div className="field field--full">
                <label htmlFor="project-description">Descripción</label>
                <textarea id="project-description" {...register('description')} aria-invalid={Boolean(errors.description)} />
                {errors.description && <span className="error" role="alert">{errors.description.message}</span>}
            </div>
                </div>
            </section>
            <section className="formSection">
                <div className="formSectionHeading"><span>02</span><div><h2>Detalles y clasificación</h2><p>Asigna el año, el cliente y la categoría del proyecto.</p></div></div>
                <div className="formSectionGrid">
            <div className="field">
                <label htmlFor="project-year">Año</label>
                <input id="project-year" {...register('year', { valueAsNumber: true })} type="number" aria-invalid={Boolean(errors.year)} />
                {errors.year && <span className="error" role="alert">{errors.year.message}</span>}
            </div>

            <div className="field field--checkbox">
                <label className="checkLabel">
                    <input {...register('featured')} type="checkbox" />
                    <span><strong>Proyecto destacado</strong><small>Mostrar en la portada del portfolio.</small></span>
                </label>
            </div>

            <div className="field">
                <label htmlFor="project-category">Categoría</label>
                <select id="project-category" {...register('categoryId')} aria-invalid={Boolean(errors.categoryId)}>
                    <option value="">Selecciona categoría</option>
                    {categoriesData.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                {errors.categoryId && <span className="error" role="alert">{errors.categoryId.message}</span>}
                <input
                    aria-label="Crear categoría nueva"
                    {...register('newCategoryName')}
                    type="text"
                    placeholder="O escribe una nueva categoría"
                />
                {errors.newCategoryName && <span className="error" role="alert">{errors.newCategoryName.message}</span>}
            </div>

            <div className="field">
                <label htmlFor="project-client">Cliente</label>
                <select id="project-client" {...register('clientId')} aria-invalid={Boolean(errors.clientId)}>
                    <option value="">Selecciona cliente</option>
                    {clientsData.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
                {errors.clientId && <span className="error" role="alert">{errors.clientId.message}</span>}
                <input
                    aria-label="Crear cliente nuevo"
                    {...register('newClientName')}
                    type="text"
                    placeholder="O escribe un nuevo cliente"
                />
                {errors.newClientName && <span className="error" role="alert">{errors.newClientName.message}</span>}
            </div>
                </div>
            </section>
            <section className="formSection">
                <div className="formSectionHeading"><span>03</span><div><h2>Imágenes</h2><p>Haz clic en una imagen para ajustar su zoom y posición.</p></div></div>
                <div className="formSectionGrid">
            <div className="field field--full">
                <label htmlFor="project-images">Agregar imágenes</label>
                <input
                    id="project-images"
                    type="file"
                    {...register('images', {
                        onChange: (event) => {
                            const input = event.target as HTMLInputElement;
                            const files = input.files ? Array.from(input.files) : [];
                            setNewImages((previous) => [...previous, ...files.map(createNewImage)]);
                        }
                    })}
                    multiple
                    className="fileInput"
                    accept="image/png, image/jpeg, image/webp, image/avif"
                />
                <small className="fieldHint">JPG, PNG, WebP o AVIF. Las imágenes se optimizan al subirlas.</small>
            </div>

            {mode === "edit" && (
                <div className="field field--full existingImagesGroup">
                    <h3>Imágenes actuales <span>{visibleExistingImages.length}</span></h3>
                    <div className="previewGrid">
                    {visibleExistingImages.map((image, index) => (
                        <div key={image.id} className="previewCard">
                            <button
                                type="button"
                                className="imageCropPreview"
                                onClick={() => openCropEditor({
                                    kind: 'existing',
                                    id: image.id,
                                    src: image.url,
                                    fileName: image.alt || `imagen-${index + 1}`,
                                })}
                                aria-label={`Ajustar zoom y posición de la imagen ${index + 1}`}
                            >
                                <Image alt={image.alt ?? `Imagen existente ${index + 1}`} src={image.url} width={400} height={240} className="previewImage" />
                                <span className="cropPreviewAction">Ajustar encuadre</span>
                            </button>
                            <button type="button" className="removeButton" onClick={() => removeExistingImage(image.id)}>
                                Quitar imagen
                            </button>
                        </div>
                    ))}
                    </div>
                    {!visibleExistingImages.length && <p className="noImagesMessage">No quedan imágenes actuales.</p>}
                </div>
            )}

            {!!newImages.length && (
                <div className="newImagesSection field--full">
                    <h3>Nuevas imágenes <span>{newImages.length}</span></h3>
                    <div className="previewGrid">
                        {newImages.map((newImage, index) => (
                            <div key={newImage.id} className="previewCard">
                                <button
                                    type="button"
                                    className="imageCropPreview"
                                    onClick={() => openCropEditor({ kind: 'new', id: newImage.id, src: newImage.previewUrl, fileName: newImage.file.name })}
                                    aria-label={`Ajustar zoom y posición de la nueva imagen ${index + 1}`}
                                >
                                    <Image alt={`Vista previa ${index + 1}`} src={newImage.previewUrl} width={400} height={240} className="previewImage" />
                                    <span className="cropPreviewAction">Ajustar encuadre</span>
                                </button>
                                <button type="button" className="removeButton" onClick={() => removeNewImage(newImage.id)}>Quitar imagen</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
                </div>
            </section>

            <div className="submitRow">
                <button type="submit" className="saveButton" disabled={isSubmitting}>
                    {isUploadingImages ? "Optimizando imágenes..." : isSubmitting ? "Guardando..." : mode === "edit" ? "Guardar cambios" : "Crear Proyecto"}
                </button>
                <button type="button" className="cancelButton" onClick={() => router.push('/dashboard/projects')} disabled={isSubmitting}>
                    Cancelar
                </button>
            </div>
            {cropTarget && (
                <ImageCropEditor
                    key={`${cropTarget.kind}-${cropTarget.id}`}
                    src={cropTarget.src}
                    fileName={cropTarget.fileName}
                    onCancel={() => setCropTarget(null)}
                    onSave={saveCroppedImage}
                />
            )}
        </form>
    );
};

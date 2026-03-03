'use server'

import { prisma } from "@/lib/prisma"
import { mapProject } from "@/lib/mappers/project.mapper";
import { Project, ProjectCreateInput, ProjectUpdateInput } from "@/types";
import { createProjectSchema } from "@/utils/schemas/projectSchema";
import { revalidatePath } from "next/cache";
import { toSlug } from "@/lib/utils";
import { deleteProjectImagesFromCloudinary, uploadImages } from "@/lib/services";
import { randomUUID } from "node:crypto";

const getUniqueClientSlugInTx = async (
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    name: string,
): Promise<string> => {
    const baseSlug = toSlug(name) || 'cliente';
    let candidateSlug = baseSlug;
    let suffix = 2;

    while (true) {
        const existing = await tx.client.findUnique({
            where: { slug: candidateSlug },
            select: { id: true },
        });

        if (!existing) {
            return candidateSlug;
        }

        candidateSlug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }
};

const resolveCategoryIdInTx = async (
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    categoryIdInput?: string,
    newCategoryNameInput?: string,
): Promise<string | undefined> => {
    const categoryId = categoryIdInput?.trim();
    const newCategoryName = newCategoryNameInput?.trim();

    if (newCategoryName) {
        const slug = toSlug(newCategoryName);
        return (await tx.category.upsert({
            where: { slug },
            update: {},
            create: {
                name: newCategoryName,
                slug,
            },
        })).id;
    }

    if (!categoryId) return undefined;

    const existingCategory = await tx.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
    });

    if (!existingCategory) {
        throw new Error('La categoría seleccionada no existe');
    }

    return existingCategory.id;
};

const resolveClientIdInTx = async (
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    clientIdInput?: string,
    newClientNameInput?: string,
): Promise<string | undefined> => {
    const clientId = clientIdInput?.trim();
    const newClientName = newClientNameInput?.trim();

    if (newClientName) {
        return (await tx.client.findFirst({ where: { name: newClientName } })
            ?? await tx.client.create({
                data: {
                    name: newClientName,
                    slug: await getUniqueClientSlugInTx(tx, newClientName),
                }
            })).id;
    }

    if (!clientId) return undefined;

    const existingClient = await tx.client.findUnique({
        where: { id: clientId },
        select: { id: true },
    });

    if (!existingClient) {
        throw new Error('El cliente seleccionado no existe');
    }

    return existingClient.id;
};

export const updateProject = async (id: string, updatedData: ProjectUpdateInput): Promise<Project> => {
    const project = await prisma.project.findFirst({
        where: { id },
        include: {
            images: {
                select: {
                    id: true,
                    url: true,
                },
            },
        },
    });

    if (!project) {
        throw new Error(`Proyecto con id ${id} no encontrado`);
    }

    const keepSet = new Set(updatedData.keptExistingImageIds ?? []);
    const keptExistingImages = project.images.filter((img) => keepSet.has(img.id));
    const newImages = updatedData.images ?? [];

    if (keptExistingImages.length + newImages.length === 0) {
        throw new Error('El proyecto debe tener al menos una imagen');
    }

    const imagesToDelete = project.images.filter((img) => !keepSet.has(img.id));

    if (imagesToDelete.length > 0) {
        await deleteProjectImagesFromCloudinary(imagesToDelete.map((img) => img.url));
    }

    const uploadedImages = await uploadImages(updatedData.images ?? []);

    const updatedProject = await prisma.$transaction(async (tx) => {
        const categoryId = await resolveCategoryIdInTx(tx, updatedData.categoryId, updatedData.newCategoryName);
        const clientId = await resolveClientIdInTx(tx, updatedData.clientId, updatedData.newClientName);

        if (!categoryId || !clientId) {
            throw new Error('Categoría y cliente son obligatorios');
        }

        return tx.project.update({
            where: { id },
            data: {
                title: updatedData.title,
                slug: updatedData.slug,
                description: updatedData.description,
                year: updatedData.year,
                featured: updatedData.featured,
                categoryId,
                clientId,
                images: {
                    deleteMany: {
                        id: { in: imagesToDelete.map((img) => img.id) },
                    },
                    create: uploadedImages.map((image) => ({
                        id: randomUUID(),
                        url: image.url,
                        order: image.order,
                        alt: image.alt ?? undefined,
                    })),
                },
            },
            include: { images: true, category: true, client: true },
        });
    });
    revalidatePath('/dashboard/projects')
    return mapProject(updatedProject);
}

export const addProject = async (projectData: ProjectCreateInput): Promise<Project> => {
    try {
        const validatedData = await createProjectSchema.validate(projectData, {
            abortEarly: false,
            stripUnknown: true
        });

        if (!validatedData.images || validatedData.images.length === 0) {
            throw new Error('El proyecto debe tener al menos una imagen');
        }
        const uploadedImages = await uploadImages(validatedData.images ?? []);

        const project = await prisma.$transaction(async (tx) => {
            const categoryId = await resolveCategoryIdInTx(tx, validatedData.categoryId, validatedData.newCategoryName);
            const clientId = await resolveClientIdInTx(tx, validatedData.clientId, validatedData.newClientName);

            if (!categoryId || !clientId) {
                throw new Error('Categoría y cliente son obligatorios');
            }

            return tx.project.create({
                data: {
                    id: validatedData.id,
                    title: validatedData.title,
                    slug: validatedData.slug,
                    description: validatedData.description,
                    year: validatedData.year,
                    featured: validatedData.featured,
                    categoryId,
                    clientId,
                    images: {
                        create: uploadedImages.map((image) => ({
                            id: image.id,
                            url: image.url,
                            alt: image.alt ?? undefined,
                            order: image.order,
                        }))
                    }
                },
                include: {
                    images: true,
                    category: true,
                    client: true
                }
            });
        });

        revalidatePath('/dashboard/projects')
        return mapProject(project);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear el proyecto';
        throw new Error(`Error al crear el proyecto: ${errorMessage}`);
    }
}

export const deleteProjectById = async (id: string): Promise<void> => {
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            images: {
                select: {
                    url: true,
                },
            },
        },
    });

    if (!project) {
        throw new Error(`Proyecto con id ${id} no encontrado`);
    }

    const imageUrls = project.images.map((image) => image.url);
    await deleteProjectImagesFromCloudinary(imageUrls);

    await prisma.project.delete({ where: { id } });
    revalidatePath('/dashboard/projects');
};
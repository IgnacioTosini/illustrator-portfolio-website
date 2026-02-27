'use server'

import { prisma } from "@/lib/prisma"
import { mapProject } from "@/lib/mappers/project.mapper";
import { Project, ProjectCreateInput, ProjectUpdateInput } from "@/types";
import { createProjectSchema } from "@/utils/schemas/projectSchema";
import { revalidatePath } from "next/cache";
import { toSlug } from "@/lib/utils";
import { deleteProjectImagesFromCloudinary, uploadImages } from "@/lib/services";
import { randomUUID } from "node:crypto";

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
    const imagesToDelete = project.images.filter((img) => !keepSet.has(img.id));

    if (imagesToDelete.length > 0) {
        await deleteProjectImagesFromCloudinary(imagesToDelete.map((img) => img.url));
    }

    const uploadedImages = await uploadImages(updatedData.images ?? []);

    const updatedProject = await prisma.project.update({
        where: { id },
        data: {
            title: updatedData.title,
            slug: updatedData.slug,
            description: updatedData.description,
            year: updatedData.year,
            featured: updatedData.featured,
            category: { connect: { id: updatedData.categoryId } },
            client: { connect: { id: updatedData.clientId } },
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
    revalidatePath('/dashboard/projects')
    return mapProject(updatedProject);
}

export const addProject = async (projectData: ProjectCreateInput): Promise<Project> => {
    try {
        const validatedData = await createProjectSchema.validate(projectData, {
            abortEarly: false,
            stripUnknown: true
        });

        const uploadedImages = await uploadImages(validatedData.images ?? []);

        const project = await prisma.$transaction(async (tx) => {
            const newCategoryName = validatedData.newCategoryName?.trim();
            const newClientName = validatedData.newClientName?.trim();

            const categoryId = validatedData.categoryId?.trim()
                ? validatedData.categoryId
                : newCategoryName
                    ? (await tx.category.upsert({
                        where: { slug: toSlug(newCategoryName) },
                        update: {},
                        create: {
                            name: newCategoryName,
                            slug: toSlug(newCategoryName),
                        },
                    })).id
                    : undefined;

            const clientId = validatedData.clientId?.trim()
                ? validatedData.clientId
                : newClientName
                    ? (await tx.client.findFirst({ where: { name: newClientName } })
                        ?? await tx.client.create({ data: { name: newClientName } })).id
                    : undefined;

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
import { Prisma } from "@prisma/client";
import { Project } from "@/types";

type PrismaProjectWithRelations = Prisma.ProjectGetPayload<{
    include: {
        images: true;
        category: true;
        client: true;
    };
}>;

export function mapProject(
    prismaProject: PrismaProjectWithRelations
): Project {
    return {
        id: prismaProject.id,
        title: prismaProject.title,
        slug: prismaProject.slug,
        description: prismaProject.description,
        year: prismaProject.year ?? null,
        featured: prismaProject.featured,
        categoryId: prismaProject.categoryId,
        clientId: prismaProject.clientId,

        category: prismaProject.category,

        client: {
            id: prismaProject.client.id,
            name: prismaProject.client.name,
            slug: prismaProject.client.slug,
            ...(prismaProject.client.website != null
                ? { website: prismaProject.client.website }
                : {}),
        },

        images: prismaProject.images.map((image) => ({
            id: image.id,
            url: image.url,
            order: image.order,
            ...(image.alt != null ? { alt: image.alt } : {}),
        })),

        createdAt: prismaProject.createdAt.toISOString(),
    };
}
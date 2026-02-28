import { Client } from "@/types";

type ClientRow = {
    id: string;
    name: string;
    slug: string;
    website: string | null;
    _count?: {
        projects: number;
    };
};

export function mapClient(prismaClient: ClientRow): Client {
    return {
        id: prismaClient.id,
        name: prismaClient.name,
        slug: prismaClient.slug,
        ...(prismaClient.website != null ? { website: prismaClient.website } : {}),
        ...(prismaClient._count ? { projectsCount: prismaClient._count.projects } : {}),
    };
}
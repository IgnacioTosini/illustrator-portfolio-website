import { Category } from "@/types";

type CategoryRow = {
    id: string;
    name: string;
    slug: string;
    _count?: {
        projects: number;
    };
};

export function mapCategory(prismaCategory: CategoryRow): Category {
    return {
        id: prismaCategory.id,
        name: prismaCategory.name,
        slug: prismaCategory.slug,
        ...(prismaCategory._count ? { projectsCount: prismaCategory._count.projects } : {}),
    };
}

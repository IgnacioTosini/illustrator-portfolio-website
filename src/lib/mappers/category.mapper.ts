import { Category } from "@/types";

type CategoryRow = {
    id: string;
    name: string;
    slug: string;
};

export function mapCategory(prismaCategory: CategoryRow): Category {
    return {
        id: prismaCategory.id,
        name: prismaCategory.name,
        slug: prismaCategory.slug,
    };
}
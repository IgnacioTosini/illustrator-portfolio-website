import { prisma } from "@/lib/prisma";
import { Category } from "@/types";
import { mapCategory } from "@/lib/mappers/category.mapper";

export const getCategories = async (): Promise<Category[]> => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                projects: {
                    include: {
                        images: true,
                        category: true,
                        client: true,
                    },
                },
            },
        });

        return categories.map(mapCategory);
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener categorías");
    }
};
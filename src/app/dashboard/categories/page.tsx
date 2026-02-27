import CategoriesClient from "@/components/admin/components/category/CategoriesClient/CategoriesClient";
import { prisma } from "@/lib/prisma";
import { mapCategory } from "@/lib/mappers/category.mapper";
import "./_categories.scss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriesPage() {
    const rawCategories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
    });

    const categories = rawCategories.map(mapCategory);
    return (
        <div className="categoriesPage">
            <CategoriesClient categories={categories} />
        </div>
    );
}
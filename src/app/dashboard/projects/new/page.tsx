import { ProjectForm } from "@/components/admin/components/ui/ProjectForm/ProjectForm";
import { prisma } from "@/lib/prisma";
import { mapCategory } from "@/lib/mappers/category.mapper";
import { mapClient } from "@/lib/mappers/client.mapper";
import './_newProjectPage.scss';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewProjectPage() {
  const [rawCategories, rawClients] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, website: true },
    }),
  ]);

  const categories = rawCategories.map(mapCategory);
  const clients = rawClients.map(mapClient);

  return (
    <div className="newProjectPage">
      <ProjectForm categories={categories} clients={clients} />
    </div>
  );
}
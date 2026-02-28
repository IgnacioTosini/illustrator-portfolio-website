import ClientsList from "@/components/admin/components/client/ClientsList/ClientsList";
import { prisma } from "@/lib/prisma";
import { mapClient } from "@/lib/mappers/client.mapper";
import "./_client.scss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ClientsPage() {
    const rawClients = await prisma.client.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, website: true, slug: true },
    });

    const clients = rawClients.map(mapClient);
    return (
        <div className="clientsPage">
            <ClientsList clients={clients} />
        </div>
    );
}
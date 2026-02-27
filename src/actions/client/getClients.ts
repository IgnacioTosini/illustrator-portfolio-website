import { prisma } from "@/lib/prisma";
import { Client } from "@/types";
import { mapClient } from "@/lib/mappers/client.mapper";

export const getClients = async (): Promise<Client[]> => {
    try {
        const clients = await prisma.client.findMany({
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

        return clients.map(mapClient);
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener clientes");
    }
};
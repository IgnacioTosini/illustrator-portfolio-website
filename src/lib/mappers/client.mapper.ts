import { Client } from "@/types";

type ClientRow = {
    id: string;
    name: string;
    website: string | null;
};

export function mapClient(prismaClient: ClientRow): Client {
    return {
        id: prismaClient.id,
        name: prismaClient.name,
        ...(prismaClient.website != null ? { website: prismaClient.website } : {}),
    };
}
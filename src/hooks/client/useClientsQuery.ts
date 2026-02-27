"use client";

import { useQuery } from "@tanstack/react-query";
import { Client } from "@/types";

async function fetchClients() {
    const res = await fetch("/api/clients", { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener clientes");
    return res.json();
}

export function useClientsQuery(initialData?: Client[]) {
    return useQuery<Client[]>({
        queryKey: ["clients"],
        queryFn: fetchClients,
        initialData,
        staleTime: 0,
        refetchOnMount: "always",
    });
}
"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchClients() {
    const res = await fetch("/api/clients", { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener clientes");
    return res.json();
}

export function useClientsQuery() {
    return useQuery({
        queryKey: ["clients"],
        queryFn: fetchClients,
    });
}
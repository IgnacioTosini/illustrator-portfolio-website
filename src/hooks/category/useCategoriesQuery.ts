"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchCategories() {
    const res = await fetch("/api/categories", { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener categorías");
    return res.json();
}

export function useCategoriesQuery() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });
}
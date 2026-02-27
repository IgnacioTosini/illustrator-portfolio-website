"use client";

import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

async function fetchCategories() {
    const res = await fetch("/api/categories", { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener categorías");
    return res.json();
}

export function useCategoriesQuery(initialData?: Category[]) {
    return useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        initialData,
        staleTime: 0,
        refetchOnMount: "always",
    });
}
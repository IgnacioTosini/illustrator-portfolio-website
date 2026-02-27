"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCategoryMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch("/api/categories", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? "No se pudo eliminar");
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}
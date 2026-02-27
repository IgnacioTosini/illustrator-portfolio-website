"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteProjectMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("No se pudo eliminar el proyecto");
            return res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["projects"] });
        },
    });
}
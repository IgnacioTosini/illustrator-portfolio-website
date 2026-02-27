"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("No se pudo crear el proyecto");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}
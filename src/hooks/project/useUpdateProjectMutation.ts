"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateProjectInput = {
    id: string;
    slug?: string;
    payload: Record<string, unknown>;
};

export function useUpdateProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: UpdateProjectInput) => {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("No se pudo actualizar el proyecto");
            return res.json();
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            if (variables.slug) {
                queryClient.invalidateQueries({ queryKey: ["project", variables.slug] });
            }
        },
    });
}
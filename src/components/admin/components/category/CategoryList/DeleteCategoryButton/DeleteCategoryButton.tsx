'use client';

import { useDeleteCategoryMutation } from '@/hooks/category/useDeleteCategoryMutation';
import { toast } from 'react-toastify';

interface Props {
    id: string;
}

export default function DeleteCategoryButton({ id }: Props) {
    const deleteMutation = useDeleteCategoryMutation();

    const onDelete = async () => {
        const confirmed = window.confirm('¿Eliminar esta categoría?');
        if (!confirmed) return;

        try {
            const result = await deleteMutation.mutateAsync(id);
            toast.success(result?.message ?? 'Categoría eliminada');
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'No se pudo eliminar.');
        }
    };

    return (
        <button
            type="button"
            className="actionBtn actionBtn--danger"
            onClick={onDelete}
            disabled={deleteMutation.isPending}
        >
            Eliminar
        </button>
    );
}
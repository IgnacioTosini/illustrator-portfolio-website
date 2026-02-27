'use client';

import { deleteClient } from '@/actions/client/client-actions';
import { toast } from 'react-toastify';

interface Props {
    id: string;
}

export default function DeleteClientButton({ id }: Props) {
    const onDelete = async () => {
        const confirmed = window.confirm('¿Eliminar este cliente?');
        if (!confirmed) return;

        const fd = new FormData();
        fd.append('id', id);

        const result = await deleteClient(fd);

        if (result?.ok) {
            toast.success(result.message);
        } else {
            toast.error(result?.message ?? 'No se pudo eliminar.');
        }
    };

    return (
        <button type="button" className="actionBtn actionBtn--danger" onClick={onDelete}>
            Eliminar
        </button>
    );
}
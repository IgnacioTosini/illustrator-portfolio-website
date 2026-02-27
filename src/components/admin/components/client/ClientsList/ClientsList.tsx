'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Title } from '@/components/ui/Title/Title';
import { Client } from '@/types';
import { AdminModal } from '../../ui/AdminModal/AdminModal';
import { toast } from 'react-toastify';
import { ClientList } from '../ClientList/ClientList';
import { createClient, updatedClient } from '@/actions/client/client-actions';
import './_clientsList.scss';

interface Props {
    clients: Client[];
}

export default function ClientsList({ clients }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [mode, setMode] = useState<'create' | 'edit' | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [search, setSearch] = useState('');

    const filteredClients = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (!q) return clients;

        return clients.filter((client) =>
            client.name.toLowerCase().includes(q) || client.website?.toLowerCase().includes(q));
    }, [clients, search]);

    const openCreate = () => {
        setSelectedClient(null);
        setMode('create');
    };

    const openEdit = (client: Client) => {
        setSelectedClient(client);
        setMode('edit');
    };

    const closeModal = () => {
        setSelectedClient(null);
        setMode(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (mode === 'create') {
            const { ok, message, error } = await createClient(formData);
            if (ok) {
                await queryClient.invalidateQueries({ queryKey: ['clients'] });
                router.refresh();
                toast.success('Cliente creado correctamente');
                closeModal();
            } else {
                toast.error(`${message}`);
                if (error) {
                    console.error('Error details:', error);
                }
            }
        } else if (mode === 'edit' && selectedClient) {
            formData.append('id', selectedClient.id);
            const { ok, message, error } = await updatedClient(formData);
            if (ok) {
                await queryClient.invalidateQueries({ queryKey: ['clients'] });
                router.refresh();
                toast.success('Cliente actualizado correctamente');
                closeModal();
            } else {
                toast.error(`${message}`);
                if (error) {
                    console.error('Error details:', error);
                }
            }
        }
    }

    return (
        <div className="clientsList">
            <Title title={'Clientes'} subTitle={'Gestiona tus clientes'} />
            <div className="dashboardLinks">
                <button onClick={openCreate} className="dashboardLink">Agregar nuevo cliente</button>
            </div>
            <input
                type="text"
                placeholder="Buscar cliente..."
                className="clientSearch"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ClientList clients={filteredClients} onEdit={openEdit} />
            <AdminModal isOpen={mode !== null} onClose={closeModal}>
                {mode === 'create' ? <h2>Nuevo cliente</h2> : <h2>Editar cliente</h2>}
                <form onSubmit={handleSubmit} className="clientForm">
                    <div className="field">
                        <label>Nombre</label>
                        <input
                            name="name"
                            defaultValue={mode === 'edit' ? selectedClient?.name : ''}
                        />
                    </div>

                    <div className="field">
                        <label>Website</label>
                        <input
                            name="website"
                            defaultValue={mode === 'edit' ? selectedClient?.website : ''}
                        />
                    </div>

                    <button type="submit" className="adminModalBtn">
                        {mode === 'create' ? 'Crear' : 'Guardar cambios'}
                    </button>
                    <button onClick={closeModal} className="adminModalBtn">
                        Cerrar
                    </button>
                </form>
            </AdminModal>
        </div>
    );
}
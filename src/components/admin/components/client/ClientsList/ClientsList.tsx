'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Client } from '@/types';
import { AdminModal } from '../../ui/AdminModal/AdminModal';
import { toast } from 'react-toastify';
import { ClientList } from '../ClientList/ClientList';
import { createClient, updatedClient } from '@/actions/client/client-actions';

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
            <section className="managementSectionHeader">
                <div>
                    <span className="managementEyebrow">RELACIONES</span>
                    <h1>Clientes</h1>
                    <p>Organiza las marcas y personas detrás de cada proyecto.</p>
                </div>
                <button onClick={openCreate} className="dashboardLink"><span aria-hidden="true">＋</span> Agregar cliente</button>
            </section>
            <div className="managementListToolbar">
                <p>{filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'}</p>
                <label className="managementSearch">
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        placeholder="Buscar clientes"
                        aria-label="Buscar clientes por nombre o sitio web"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
            </div>
            {filteredClients.length ? (
                <ClientList clients={filteredClients} onEdit={openEdit} />
            ) : (
                <div className="managementEmptyState">
                    <strong>{clients.length ? 'No encontramos clientes.' : 'Todavía no hay clientes.'}</strong>
                    <span>{clients.length ? 'Prueba otra búsqueda.' : 'Agrega un cliente para asociarlo a tus proyectos.'}</span>
                </div>
            )}
            <AdminModal
                isOpen={mode !== null}
                onClose={closeModal}
                title={mode === 'edit' ? 'Editar cliente' : 'Nuevo cliente'}
                description={mode === 'edit' ? 'Actualiza los datos de este cliente.' : 'Añade una persona o marca para asociarla a proyectos.'}
            >
                <form onSubmit={handleSubmit} className="clientForm">
                    <div className="field">
                        <label htmlFor="client-name">Nombre</label>
                        <input
                            id="client-name"
                            name="name"
                            required
                            defaultValue={mode === 'edit' ? selectedClient?.name : ''}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="client-website">Sitio web</label>
                        <input
                            id="client-website"
                            type="text"
                            inputMode="url"
                            name="website"
                            placeholder="https://ejemplo.com"
                            defaultValue={mode === 'edit' ? selectedClient?.website : ''}
                        />
                    </div>

                    <div className="modalActions">
                        <button type="button" onClick={closeModal} className="modalCancelBtn">Cancelar</button>
                        <button type="submit" className="adminModalBtn">{mode === 'create' ? 'Crear cliente' : 'Guardar cambios'}</button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}

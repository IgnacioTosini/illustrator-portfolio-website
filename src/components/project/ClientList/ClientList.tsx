'use client';

import { clients } from '@/mocks'
import './_clientList.scss'

interface Props {
    selectedClient: string | null;
    onSelectClient: (id: string | null) => void;
}

export const ClientList = ({ selectedClient, onSelectClient }: Props) => {
    return (
        <ul className="clientList">
            <li
                className={`client ${selectedClient === null ? "selected" : ""}`}
                onClick={() => onSelectClient(null)}
            >
                Todos
            </li>

            {clients.map(client => (
                <li
                    key={client.id}
                    className={`client ${selectedClient === client.id ? "selected" : ""}`}
                    onClick={() => onSelectClient(client.id)}
                >
                    {client.name}
                </li>
            ))}
        </ul>
    );
};
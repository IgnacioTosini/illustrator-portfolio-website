import { Client } from '@/types';
import DeleteClientButton from './DeleteClientButton/DeleteCategoryButton';
import './_clientList.scss';

interface Props {
    clients: Client[];
    onEdit: (client: Client) => void;
}

export const ClientList = ({ clients, onEdit }: Props) => {
    return (
        <div className="clientList">
            <table className="clientTable">
                <thead className="clientTableHeader">
                    <tr className="clientTableRow">
                        <th className="clientTableCell">ID</th>
                        <th className="clientTableCell">Website</th>
                        <th className="clientTableCell">Nombre</th>
                        <th className="clientTableCell">Acciones</th>
                    </tr>
                </thead>

                <tbody className="clientTableBody">
                    {clients.map((client) => (
                        <tr key={client.id} className="clientTableRow">
                            <td className="clientTableCell">{client.id}</td>
                            <td className="clientTableCell">{client.website}</td>
                            <td className="clientTableCell">{client.name}</td>
                            <td className="clientTableCell">
                                <div className="actions">
                                    <button onClick={() => onEdit(client)} className="actionBtn">
                                        Editar
                                    </button>
                                    <DeleteClientButton id={client.id} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
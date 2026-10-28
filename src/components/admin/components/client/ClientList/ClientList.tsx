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
                <caption className="visuallyHidden">Clientes y cantidad de proyectos asociados</caption>
                <thead className="clientTableHeader">
                    <tr className="clientTableRow">
                        <th scope="col" className="clientTableCell">Cliente</th>
                        <th scope="col" className="clientTableCell">Sitio web</th>
                        <th scope="col" className="clientTableCell">Proyectos</th>
                        <th scope="col" className="clientTableCell">Acciones</th>
                    </tr>
                </thead>

                <tbody className="clientTableBody">
                    {clients.map((client) => (
                        <tr key={client.id} className="clientTableRow">
                            <td className="clientTableCell">{client.name}</td>
                            <td className="clientTableCell">
                                {client.website ? <a href={client.website} target="_blank" rel="noreferrer">{client.website}</a> : <span>—</span>}
                            </td>
                            <td className="clientTableCell">{client.projectsCount ?? 0}</td>
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

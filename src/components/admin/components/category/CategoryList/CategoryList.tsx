import DeleteCategoryButton from './DeleteCategoryButton/DeleteCategoryButton';
import { Category } from '@/types';
import './_categoryList.scss';

interface Props {
    categories: Category[];
    onEdit: (category: Category) => void;
}

export const CategoryList = ({ categories, onEdit }: Props) => {
    return (
        <div className="categoryList">
            <table className="categoryTable">
                <thead className="categoryTableHeader">
                    <tr className="categoryTableRow">
                        <th className="categoryTableCell">ID</th>
                        <th className="categoryTableCell">Slug</th>
                        <th className="categoryTableCell">Nombre</th>
                        <th className="categoryTableCell">Acciones</th>
                    </tr>
                </thead>

                <tbody className="categoryTableBody">
                    {categories.map((category) => (
                        <tr key={category.id} className="categoryTableRow">
                            <td className="categoryTableCell">{category.id}</td>
                            <td className="categoryTableCell">{category.slug}</td>
                            <td className="categoryTableCell">{category.name}</td>
                            <td className="categoryTableCell">
                                <div className="actions">
                                    <button onClick={() => onEdit(category)} className="actionBtn">
                                        Editar
                                    </button>
                                    <DeleteCategoryButton id={category.id} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
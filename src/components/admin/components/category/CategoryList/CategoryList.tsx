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
                <caption className="visuallyHidden">Categorías y cantidad de proyectos asociados</caption>
                <thead className="categoryTableHeader">
                    <tr className="categoryTableRow">
                        <th scope="col" className="categoryTableCell">Categoría</th>
                        <th scope="col" className="categoryTableCell">Slug</th>
                        <th scope="col" className="categoryTableCell">Proyectos</th>
                        <th scope="col" className="categoryTableCell">Acciones</th>
                    </tr>
                </thead>

                <tbody className="categoryTableBody">
                    {categories.map((category) => (
                        <tr key={category.id} className="categoryTableRow">
                            <td className="categoryTableCell">{category.name}</td>
                            <td className="categoryTableCell">{category.slug}</td>
                            <td className="categoryTableCell">{category.projectsCount ?? 0}</td>
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

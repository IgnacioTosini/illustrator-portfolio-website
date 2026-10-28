'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { CategoryList } from '../CategoryList/CategoryList';
import { Category } from '@/types';
import { AdminModal } from '../../ui/AdminModal/AdminModal';
import { createCategory, updatedCategory } from '@/actions/category/category-actions';
import { toast } from 'react-toastify';

interface Props {
    categories: Category[];
}

export default function CategoriesClient({ categories }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [mode, setMode] = useState<'create' | 'edit' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [search, setSearch] = useState('');

    const filteredCategories = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (!q) return categories;

        return categories.filter((category) =>
            category.name.toLowerCase().includes(q) || category.slug.toLowerCase().includes(q));
    }, [categories, search]);

    const openCreate = () => {
        setSelectedCategory(null);
        setMode('create');
    };

    const openEdit = (category: Category) => {
        setSelectedCategory(category);
        setMode('edit');
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setMode(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (mode === 'create') {
            const { ok, message, error } = await createCategory(formData);
            if (ok) {
                await queryClient.invalidateQueries({ queryKey: ['categories'] });
                router.refresh();
                toast.success('Categoría creada correctamente');
                closeModal();
            } else {
                toast.error(`${message}`);
                if (error) {
                    console.error('Error details:', error);
                }
            }
        } else if (mode === 'edit' && selectedCategory) {
            formData.append('id', selectedCategory.id);
            const { ok, message, error } = await updatedCategory(formData);
            if (ok) {
                await queryClient.invalidateQueries({ queryKey: ['categories'] });
                router.refresh();
                toast.success('Categoría actualizada correctamente');
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
        <div className="categoriesClient">
            <section className="managementSectionHeader">
                <div>
                    <span className="managementEyebrow">ORGANIZACIÓN</span>
                    <h1>Categorías</h1>
                    <p>Clasifica el trabajo para que sea más fácil de explorar.</p>
                </div>
                <button onClick={openCreate} className="dashboardLink"><span aria-hidden="true">＋</span> Agregar categoría</button>
            </section>
            <div className="managementListToolbar">
                <p>{filteredCategories.length} {filteredCategories.length === 1 ? 'categoría' : 'categorías'}</p>
                <label className="managementSearch">
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        placeholder="Buscar categorías"
                        aria-label="Buscar categorías por nombre o slug"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
            </div>
            {filteredCategories.length ? (
                <CategoryList categories={filteredCategories} onEdit={openEdit} />
            ) : (
                <div className="managementEmptyState">
                    <strong>{categories.length ? 'No encontramos categorías.' : 'Todavía no hay categorías.'}</strong>
                    <span>{categories.length ? 'Prueba otra búsqueda.' : 'Crea categorías para ordenar tus proyectos.'}</span>
                </div>
            )}
            <AdminModal
                isOpen={mode !== null}
                onClose={closeModal}
                title={mode === 'edit' ? 'Editar categoría' : 'Nueva categoría'}
                description={mode === 'edit' ? 'Actualiza el nombre o el identificador de esta categoría.' : 'Crea una categoría para mantener ordenado el portfolio.'}
            >
                <form onSubmit={handleSubmit} className="categoryForm">
                    <div className="field">
                        <label htmlFor="category-name">Nombre</label>
                        <input
                            id="category-name"
                            name="name"
                            required
                            defaultValue={mode === 'edit' ? selectedCategory?.name : ''}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="category-slug">Slug</label>
                        <input
                            id="category-slug"
                            name="slug"
                            required
                            defaultValue={mode === 'edit' ? selectedCategory?.slug : ''}
                        />
                    </div>

                    <div className="modalActions">
                        <button type="button" onClick={closeModal} className="modalCancelBtn">Cancelar</button>
                        <button type="submit" className="adminModalBtn">{mode === 'create' ? 'Crear categoría' : 'Guardar cambios'}</button>
                    </div>
                </form>
            </AdminModal>
        </div>
    );
}

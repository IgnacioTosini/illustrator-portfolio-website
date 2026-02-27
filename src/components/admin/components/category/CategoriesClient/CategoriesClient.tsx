'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Title } from '@/components/ui/Title/Title';
import { CategoryList } from '../CategoryList/CategoryList';
import { Category } from '@/types';
import { AdminModal } from '../../ui/AdminModal/AdminModal';
import { createCategory, updatedCategory } from '@/actions/category/category-actions';
import { toast } from 'react-toastify';
import './_categoriesClient.scss';

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
            <Title title={'Categorias'} subTitle={'Gestiona tus categorias'} />
            <div className="dashboardLinks">
                <button onClick={openCreate} className="dashboardLink">Agregar nueva categoría</button>
            </div>
            <input
                type="text"
                placeholder="Buscar categoría..."
                className="categorySearch"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <CategoryList categories={filteredCategories} onEdit={openEdit} />
            <AdminModal isOpen={mode !== null} onClose={closeModal}>
                {mode === 'create' ? <h2>Nueva categoría</h2> : <h2>Editar categoría</h2>}
                <form onSubmit={handleSubmit} className="categoryForm">
                    <div className="field">
                        <label>Nombre</label>
                        <input
                            name="name"
                            defaultValue={mode === 'edit' ? selectedCategory?.name : ''}
                        />
                    </div>

                    <div className="field">
                        <label>Slug</label>
                        <input
                            name="slug"
                            defaultValue={mode === 'edit' ? selectedCategory?.slug : ''}
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
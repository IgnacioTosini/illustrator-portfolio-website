import * as yup from "yup";

const imageSchema = yup.object({
    id: yup.string().required(),
    url: yup.string().required().test(
        'valid-image-url',
        'URL de imagen inválida',
        (value) => {
            if (!value) return false;
            return value.startsWith('data:image') || /^https?:\/\//.test(value);
        }
    ),
    alt: yup.string().nullable(),
    order: yup.number().required()
});

export const createProjectSchema = yup.object({
    id: yup.string().optional(),
    title: yup.string().required().min(3),
    slug: yup.string().required(),
    description: yup.string().required(),
    year: yup.number().required().min(2000),
    featured: yup.boolean().required(),

    categoryId: yup.string().default(''),
    clientId: yup.string().default(''),
    newCategoryName: yup.string().defined().default(''),
    newClientName: yup.string().defined().default(''),

    images: yup.array().of(imageSchema).optional().default([])
}).test(
    'category-existing-or-new',
    'Selecciona una categoría existente o agrega una nueva',
    (value) => Boolean(value?.categoryId?.trim() || value?.newCategoryName?.trim())
).test(
    'client-existing-or-new',
    'Selecciona un cliente existente o agrega uno nuevo',
    (value) => Boolean(value?.clientId?.trim() || value?.newClientName?.trim())
);

export const projectFormSchema = yup.object({
    title: yup.string().required().min(3),
    slug: yup.string().required(),
    description: yup.string().required(),
    year: yup.number().required().min(2000),
    featured: yup.boolean().required(),
    categoryId: yup.string().default(''),
    clientId: yup.string().default(''),
    newCategoryName: yup.string().defined().default(''),
    newClientName: yup.string().defined().default(''),
    images: yup.mixed<FileList>().optional(),
}).test(
    'category-existing-or-new',
    'Selecciona una categoría existente o agrega una nueva',
    (value) => Boolean(value?.categoryId?.trim() || value?.newCategoryName?.trim())
).test(
    'client-existing-or-new',
    'Selecciona un cliente existente o agrega uno nuevo',
    (value) => Boolean(value?.clientId?.trim() || value?.newClientName?.trim())
);

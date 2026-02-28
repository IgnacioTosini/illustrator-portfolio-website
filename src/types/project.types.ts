export interface Category {
    id: string
    name: string
    slug: string
}

export interface Client {
    id: string
    name: string
    slug: string
    website?: string
    projectsCount?: number
}

export interface Image {
    id: string
    url: string
    alt?: string
    order: number
}

export interface Project {
    id: string
    title: string
    slug: string
    description: string
    year: number
    featured: boolean

    categoryId: string
    category: Category

    clientId: string
    client: Client

    images: Image[]

    createdAt: string
}

export interface ProjectFormValues {
    title: string
    slug: string
    description: string
    year: number
    featured: boolean
    categoryId: string
    clientId: string
    newCategoryName: string
    newClientName: string
}

export interface ProjectCreateInput extends ProjectFormValues {
    id?: string
    images?: Image[]
}

export interface ProjectUpdateInput extends ProjectCreateInput {
    keptExistingImageIds?: string[]
}
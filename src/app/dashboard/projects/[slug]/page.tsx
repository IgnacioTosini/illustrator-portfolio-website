import EditProjectPageClient from "@/components/admin/components/project/EditProjectPageClient/EditProjectPageClient";
import './_editProjectPage.scss';

interface Props {
    params: Promise<{ slug: string }>
}

export default async function EditProjectPage({ params }: Props) {
    const { slug } = await params;

    return (
        <div className="editProjectPage">
            <h1>Editar Proyecto</h1>
            <EditProjectPageClient slug={slug} />
        </div>
    );
}
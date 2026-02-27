import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/actions/project/getProjectBySlug";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ message: "Slug requerido" }, { status: 400 });
        }

        const data = await getProjectBySlug(slug);

        if (!data) {
            return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error al obtener proyecto" }, { status: 500 });
    }
}
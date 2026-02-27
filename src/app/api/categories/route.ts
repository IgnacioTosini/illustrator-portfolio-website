import { deleteCategory } from "@/actions/category/category-actions";
import { getCategories } from "@/actions/category/getCategories";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await getCategories();
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error al obtener categorías" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ message: "ID de categoría requerido" }, { status: 400 });
        }
        const formData = new FormData();
        formData.append("id", id);

        const { ok, message } = await deleteCategory(formData);
        return NextResponse.json({ ok, message }, { status: ok ? 200 : 400 });
    } catch {
        return NextResponse.json({ ok: false, message: "Error al eliminar categoría" }, { status: 500 });
    }
}
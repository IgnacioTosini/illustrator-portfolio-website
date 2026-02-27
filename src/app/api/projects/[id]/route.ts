import { NextResponse } from "next/server";
import { updateProject, deleteProjectById } from "@/actions/project/project-actions";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = await updateProject(id, body);
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error al actualizar proyecto" }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log("Deleting project with id:", id);
        await deleteProjectById(id);
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error al eliminar proyecto" }, { status: 500 });
    }
}
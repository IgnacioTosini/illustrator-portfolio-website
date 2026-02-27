import { NextResponse } from "next/server";
import { getProjects } from "@/actions/project/getProjects";
import { addProject } from "@/actions/project/project-actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const data = await getProjects();
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error al obtener proyectos" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const created = await addProject(body);
        return NextResponse.json(created, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Error al crear proyecto" }, { status: 500 });
    }
}
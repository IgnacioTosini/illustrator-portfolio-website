import { NextResponse } from "next/server";
import { getProjectsPage } from "@/actions/project/getProjects";
import { addProject } from "@/actions/project/project-actions";
import { ADMIN_PROJECTS_PAGE_SIZE } from "@/lib/pagination";
import { isDashboardAuthenticated } from "@/lib/auth/dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const data = await getProjectsPage({
            page: Number(searchParams.get('page') ?? 1),
            pageSize: Number(searchParams.get('pageSize') ?? ADMIN_PROJECTS_PAGE_SIZE),
            search: searchParams.get('search') ?? '',
        });
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error al obtener proyectos" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await isDashboardAuthenticated()) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const created = await addProject(body);
        return NextResponse.json(created, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Error al crear proyecto" }, { status: 500 });
    }
}

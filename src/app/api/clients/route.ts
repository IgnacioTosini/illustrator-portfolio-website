import { NextResponse } from "next/server";
import { getClients } from "../../../actions/client/getClients";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const data = await getClients();
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error al obtener clientes" }, { status: 500 });
    }
}
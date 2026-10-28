import { NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/auth/dashboard";
import { deleteProjectImagesFromCloudinary } from "@/lib/services";
import { getCloudinaryCloudName } from "@/lib/services/cloudinary.service";

export async function DELETE(request: Request) {
    if (!await isDashboardAuthenticated()) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    try {
        const body = await request.json() as { urls?: unknown };
        const urls = body.urls;
        const cloudName = getCloudinaryCloudName();
        if (!cloudName) return NextResponse.json({ message: "Falta la configuración de Cloudinary." }, { status: 503 });

        const cloudinaryPrefix = `https://res.cloudinary.com/${cloudName}/image/upload/`;
        if (!Array.isArray(urls) || urls.length > 20 || urls.some((url) => typeof url !== "string" || !url.startsWith(cloudinaryPrefix))) {
            return NextResponse.json({ message: "Lista de imágenes no válida." }, { status: 400 });
        }

        await deleteProjectImagesFromCloudinary(urls);
        return NextResponse.json({ deleted: urls.length });
    } catch (error) {
        console.error("No se pudieron limpiar las imágenes subidas:", error);
        return NextResponse.json({ message: "No se pudieron limpiar las imágenes." }, { status: 500 });
    }
}

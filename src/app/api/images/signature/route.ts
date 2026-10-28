import { NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/auth/dashboard";
import { createCloudinaryUploadSignature } from "@/lib/services/cloudinary.service";

export async function POST() {
    if (!await isDashboardAuthenticated()) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    try {
        return NextResponse.json(createCloudinaryUploadSignature());
    } catch (error) {
        console.error("No se pudo preparar la subida de Cloudinary:", error);
        return NextResponse.json({ message: "No se pudo preparar la subida de imágenes." }, { status: 500 });
    }
}

const MAX_IMAGE_DIMENSION = 4000;
const PREFERRED_MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_SOURCE_FILE_SIZE = 50 * 1024 * 1024;

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("No se pudo comprimir la imagen."));
        }, "image/webp", quality);
    });
}

export async function optimizeImageFile(file: File): Promise<File> {
    if (!file.type.startsWith("image/")) throw new Error("Selecciona un archivo de imagen.");
    if (file.size > MAX_SOURCE_FILE_SIZE) throw new Error("La imagen original supera el límite de 50 MB.");

    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    try {
        const longestSide = Math.max(bitmap.width, bitmap.height);
        if (file.type === "image/webp" && longestSide <= MAX_IMAGE_DIMENSION && file.size <= PREFERRED_MAX_FILE_SIZE) {
            return file;
        }

        const scale = Math.min(1, MAX_IMAGE_DIMENSION / longestSide);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));

        const context = canvas.getContext("2d");
        if (!context) throw new Error("No se pudo preparar la imagen para la subida.");
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        let blob = await canvasToWebp(canvas, 0.96);
        if (blob.size > PREFERRED_MAX_FILE_SIZE) blob = await canvasToWebp(canvas, 0.93);
        if (blob.size > PREFERRED_MAX_FILE_SIZE) blob = await canvasToWebp(canvas, 0.9);
        if (blob.size > 16 * 1024 * 1024) throw new Error("La imagen sigue siendo demasiado pesada después de optimizarla.");

        const baseName = file.name.replace(/\.[^.]+$/, "") || "imagen";
        const extension = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
        return new File([blob], `${baseName}.${extension}`, { type: blob.type || "image/webp" });
    } finally {
        bitmap.close();
    }
}

export async function uploadImageFiles(files: File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    try {
        for (const sourceFile of files) {
            const file = await optimizeImageFile(sourceFile);
            const signatureResponse = await fetch("/api/images/signature", { method: "POST" });
            const signature = await signatureResponse.json() as {
                cloudName?: string;
                apiKey?: string;
                timestamp?: number;
                publicId?: string;
                folder?: string;
                signature?: string;
                message?: string;
            };
            if (!signatureResponse.ok || !signature.cloudName || !signature.apiKey || !signature.timestamp || !signature.publicId || !signature.signature) {
                throw new Error(signature.message || "No se pudo autorizar la subida de la imagen.");
            }

            const formData = new FormData();
            formData.set("file", file, file.name);
            formData.set("api_key", signature.apiKey);
            formData.set("timestamp", String(signature.timestamp));
            formData.set("public_id", signature.publicId);
            formData.set("overwrite", "false");
            formData.set("signature", signature.signature);
            if (signature.folder) formData.set("folder", signature.folder);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`, {
                method: "POST",
                body: formData,
            });
            const result = await response.json() as { secure_url?: string; error?: { message?: string } };
            if (!response.ok || !result.secure_url) {
                throw new Error(result.error?.message || "No se pudo subir una imagen.");
            }
            uploadedUrls.push(result.secure_url);
        }

        return uploadedUrls;
    } catch (error) {
        await deleteUploadedImageUrls(uploadedUrls);
        throw error;
    }
}

export async function deleteUploadedImageUrls(urls: string[]): Promise<void> {
    if (!urls.length) return;

    try {
        const response = await fetch("/api/images/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls }),
        });
        if (!response.ok) console.error("La limpieza temporal de imágenes no se completó.");
    } catch (error) {
        console.error("No se pudieron limpiar las imágenes temporales:", error);
    }
}

export async function dataUrlToImageFile(dataUrl: string, name: string): Promise<File> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const extension = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
    return new File([blob], `${name}.${extension}`, { type: blob.type || "image/jpeg" });
}

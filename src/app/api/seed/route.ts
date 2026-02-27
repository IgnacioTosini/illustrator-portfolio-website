import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categories, clients, projects } from "@/mocks";

const isAuthorized = (request: Request) => {
	const expected = process.env.DASHBOARD_ACCESS_KEY ?? "";
	if (!expected) return false;

	const authHeader = request.headers.get("authorization") ?? "";
	const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

	const cookieHeader = request.headers.get("cookie") ?? "";
	const cookieToken = cookieHeader
		.split(";")
		.map((chunk) => chunk.trim())
		.find((chunk) => chunk.startsWith("dashboard_auth="))
		?.split("=")[1] ?? "";

	const seedKey = request.headers.get("x-seed-key") ?? "";

	return bearerToken === expected || cookieToken === expected || seedKey === expected;
};

export async function POST(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json(
			{ ok: false, message: "No autorizado" },
			{ status: 401 }
		);
	}

	try {
		const { searchParams } = new URL(request.url);
		const shouldReset = searchParams.get("reset") === "1";

		if (shouldReset) {
			await prisma.image.deleteMany();
			await prisma.project.deleteMany();
			await prisma.category.deleteMany();
			await prisma.client.deleteMany();
		}

		for (const category of categories) {
			await prisma.category.upsert({
				where: { id: category.id },
				create: {
					id: category.id,
					name: category.name,
					slug: category.slug,
				},
				update: {
					name: category.name,
					slug: category.slug,
				},
			});
		}

		for (const client of clients) {
			await prisma.client.upsert({
				where: { id: client.id },
				create: {
					id: client.id,
					name: client.name,
					website: client.website,
				},
				update: {
					name: client.name,
					website: client.website,
				},
			});
		}

		for (const project of projects) {
			await prisma.project.upsert({
				where: { id: project.id },
				create: {
					id: project.id,
					title: project.title,
					slug: project.slug,
					description: project.description,
					year: project.year,
					featured: project.featured,
					categoryId: project.categoryId,
					clientId: project.clientId,
					createdAt: new Date(project.createdAt),
				},
				update: {
					title: project.title,
					slug: project.slug,
					description: project.description,
					year: project.year,
					featured: project.featured,
					categoryId: project.categoryId,
					clientId: project.clientId,
				},
			});

			await prisma.image.deleteMany({ where: { projectId: project.id } });
			if (project.images.length > 0) {
				await prisma.image.createMany({
					data: project.images.map((image) => ({
						id: image.id,
						url: image.url,
						alt: image.alt,
						order: image.order,
						projectId: project.id,
					})),
					skipDuplicates: true,
				});
			}
		}

		return NextResponse.json({
			ok: true,
			message: "Seed completado correctamente",
			result: {
				categories: categories.length,
				clients: clients.length,
				projects: projects.length,
				images: projects.reduce((total, project) => total + project.images.length, 0),
				reset: shouldReset,
			},
		});
	} catch (error) {
		return NextResponse.json(
			{
				ok: false,
				message: "Error al ejecutar seed",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

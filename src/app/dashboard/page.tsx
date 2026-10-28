import Link from "next/link";
import { prisma } from "@/lib/prisma";
import "./_overview.scss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardOverviewPage() {
    const [projectCount, featuredCount, clientCount, categoryCount, recentProjects] = await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { featured: true } }),
        prisma.client.count(),
        prisma.category.count(),
        prisma.project.findMany({
            orderBy: { updatedAt: "desc" },
            take: 5,
            select: { id: true, title: true, slug: true, updatedAt: true },
        }),
    ]);

    const metrics = [
        { label: "Proyectos", value: projectCount, detail: `${featuredCount} destacados`, href: "/dashboard/projects", mark: "01" },
        { label: "Clientes", value: clientCount, detail: "Cartera de clientes", href: "/dashboard/clients", mark: "02" },
        { label: "Categorías", value: categoryCount, detail: "Organización del portfolio", href: "/dashboard/categories", mark: "03" },
    ];

    return (
        <main className="adminOverview">
            <section className="overviewWelcome">
                <div>
                    <span className="overviewEyebrow">ESPACIO DE TRABAJO</span>
                    <h1>Tu portfolio, en orden.</h1>
                    <p>Gestiona proyectos, clientes y categorías desde un solo lugar.</p>
                </div>
                <Link href="/dashboard/projects/new" className="overviewPrimaryAction">
                    <span aria-hidden="true">＋</span> Crear proyecto
                </Link>
            </section>

            <section className="overviewMetrics" aria-label="Resumen del portfolio">
                {metrics.map((metric) => (
                    <Link href={metric.href} className="overviewMetric" key={metric.label}>
                        <span className="metricMark">{metric.mark}</span>
                        <span className="metricLabel">{metric.label}</span>
                        <strong>{metric.value}</strong>
                        <span className="metricDetail">{metric.detail}</span>
                        <span className="metricArrow" aria-hidden="true">↗</span>
                    </Link>
                ))}
            </section>

            <section className="overviewGrid">
                <div className="overviewPanel quickActionsPanel">
                    <div className="panelHeading">
                        <div>
                            <span className="panelEyebrow">ATAJOS</span>
                            <h2>¿Qué quieres hacer?</h2>
                        </div>
                    </div>
                    <div className="quickActions">
                        <Link href="/dashboard/projects/new" className="quickAction">
                            <span className="quickActionIcon">＋</span>
                            <span><strong>Nuevo proyecto</strong><small>Sube y organiza una pieza</small></span>
                            <span className="quickActionArrow" aria-hidden="true">→</span>
                        </Link>
                        <Link href="/dashboard/clients" className="quickAction">
                            <span className="quickActionIcon">◎</span>
                            <span><strong>Administrar clientes</strong><small>Actualiza tu cartera</small></span>
                            <span className="quickActionArrow" aria-hidden="true">→</span>
                        </Link>
                        <Link href="/dashboard/categories" className="quickAction">
                            <span className="quickActionIcon">▦</span>
                            <span><strong>Ordenar categorías</strong><small>Mantén clara la navegación</small></span>
                            <span className="quickActionArrow" aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>

                <div className="overviewPanel recentPanel">
                    <div className="panelHeading">
                        <div>
                            <span className="panelEyebrow">ACTIVIDAD</span>
                            <h2>Actualizados recientemente</h2>
                        </div>
                        <Link href="/dashboard/projects" className="panelTextLink">Ver todos</Link>
                    </div>
                    {recentProjects.length ? (
                        <ul className="recentProjectList">
                            {recentProjects.map((project) => (
                                <li key={project.id}>
                                    <Link href={`/dashboard/projects/${project.slug}`}>
                                        <span className="recentProjectInitial" aria-hidden="true">{project.title.slice(0, 1)}</span>
                                        <span className="recentProjectInfo"><strong>{project.title}</strong><small>Proyecto</small></span>
                                        <span className="recentProjectArrow" aria-hidden="true">↗</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="overviewEmpty">
                            <p>Aún no tienes proyectos.</p>
                            <Link href="/dashboard/projects/new">Crea el primero →</Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

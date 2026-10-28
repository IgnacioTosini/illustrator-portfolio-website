import Link from 'next/link';
import { AdminProjectList } from '@/components/admin/components/project/AdminProjectList/AdminProjectList';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  return (
    <div className="dashboardPage">
      <div className="managementHeader">
        <div>
          <span className="managementEyebrow">BIBLIOTECA</span>
          <h1>Proyectos</h1>
          <p>Administra las piezas que aparecen en tu portfolio.</p>
        </div>
        <Link href="/dashboard/projects/new" className="dashboardLink"><span aria-hidden="true">＋</span> Nuevo proyecto</Link>
      </div>
      <div className='dashboardContent'>
        <AdminProjectList />
      </div>
    </div>
  );
}

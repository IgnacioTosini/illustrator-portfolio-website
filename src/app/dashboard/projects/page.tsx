import { Title } from '@/components';
import Link from 'next/link';
import { AdminProjectList } from '@/components/admin/components/project/AdminProjectList/AdminProjectList';
import './_dashboard.scss';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  return (
    <div className="dashboardPage">
      <Title title={'Proyectos'} subTitle={'Gestiona tus proyectos'} />
      <div className='dashboardContent'>
        <div className="dashboardLinks">
          <Link href="/dashboard/projects/new" className="dashboardLink">Agregar nuevo proyecto</Link>
        </div>
        <AdminProjectList />
      </div>
    </div>
  );
}
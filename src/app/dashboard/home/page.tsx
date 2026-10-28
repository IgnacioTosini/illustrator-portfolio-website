import { getFeaturedProjects } from '@/actions/project/getProjects';
import { getHomeContent } from '@/actions/home/getHomeContent';
import HomeContentEditor from '@/components/admin/components/home/HomeContentEditor';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomeManagementPage() {
    const [homeContent, projects] = await Promise.all([getHomeContent(), getFeaturedProjects(6)]);
    return <HomeContentEditor initialContent={homeContent} projects={projects} />;
}

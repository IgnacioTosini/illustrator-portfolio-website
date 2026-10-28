import 'server-only';

import { cookies } from 'next/headers';

export async function isDashboardAuthenticated(): Promise<boolean> {
    const expectedKey = process.env.DASHBOARD_ACCESS_KEY ?? '';
    if (!expectedKey) return false;

    const cookieStore = await cookies();
    return cookieStore.get('dashboard_auth')?.value === expectedKey;
}

export async function requireDashboardAuth(): Promise<void> {
    if (!await isDashboardAuthenticated()) {
        throw new Error('No tienes autorización para realizar esta acción.');
    }
}

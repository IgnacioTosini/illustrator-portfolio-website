import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const expected = process.env.DASHBOARD_ACCESS_KEY ?? "";
    const token = req.cookies.get("dashboard_auth")?.value ?? "";

    if (!expected || token !== expected) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
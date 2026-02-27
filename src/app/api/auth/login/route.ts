import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const key = String(formData.get("key") ?? "");
    const expected = process.env.DASHBOARD_ACCESS_KEY ?? "";

    if (!expected || key !== expected) {
        return NextResponse.redirect(new URL("/login?error=1", req.url), 302);
    }

    const res = NextResponse.redirect(new URL("/dashboard/projects", req.url), 302);

    res.cookies.set("dashboard_auth", key, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return res;
}
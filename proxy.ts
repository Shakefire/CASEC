import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isAdminPath = pathname.startsWith("/admin");
  const isEmployerPath = pathname.startsWith("/employer");
  const isStudentPath = pathname.startsWith("/student");

  if (isAdminPath || isEmployerPath || isStudentPath) {
    const isLoggedIn = request.cookies.get("casec_logged_in")?.value === "true";
    const role = request.cookies.get("casec_role")?.value;

    // If not logged in, redirect to login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based isolation
    if (isAdminPath && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isEmployerPath && role !== "employer") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isStudentPath && role !== "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employer/:path*", "/student/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get auth indicators from cookies
  const isLoggedIn = request.cookies.get("casec_logged_in")?.value === "true";
  const userRole = request.cookies.get("casec_role")?.value;

  // Define protected routes
  const isAdminPath = pathname.startsWith("/admin");
  const isEmployerPath = pathname.startsWith("/employer");
  const isStudentPath = pathname.startsWith("/student");

  if (isAdminPath || isEmployerPath || isStudentPath) {
    // 2. If NOT logged in, redirect to login
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Role-based isolation
    if (isAdminPath && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isEmployerPath && userRole !== "employer") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isStudentPath && userRole !== "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 4. If logged in and trying to access login/register, redirect to dashboard
  const authRoutes = ["/login", "/register"];
  if (isLoggedIn && authRoutes.some(path => pathname.startsWith(path))) {
    if (userRole === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    if (userRole === "employer") return NextResponse.redirect(new URL("/employer", request.url));
    if (userRole === "student") return NextResponse.redirect(new URL("/student", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employer/:path*",
    "/student/:path*",
    "/login",
    "/register",
  ],
};

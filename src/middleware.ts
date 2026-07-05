import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as any;
  const role = user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isInternalLogin = nextUrl.pathname.startsWith("/internal/login");
  const isUserLogin = nextUrl.pathname === "/login";
  const isRegister = nextUrl.pathname === "/register";

  if (isApiAuthRoute) return NextResponse.next();

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      // Redirect to correct login page
      if (nextUrl.pathname.startsWith("/dashboard/user")) {
        return NextResponse.redirect(new URL("/login", nextUrl));
      } else {
        return NextResponse.redirect(new URL("/internal/login", nextUrl));
      }
    }

    // Role-Based Access Control
    if (nextUrl.pathname.startsWith("/dashboard/user") && role !== "USER") {
      return NextResponse.redirect(new URL(getDashboardRedirect(role), nextUrl));
    }

    if (nextUrl.pathname.startsWith("/dashboard/staff") && role !== "STAFF") {
      return NextResponse.redirect(new URL(getDashboardRedirect(role), nextUrl));
    }

    if (nextUrl.pathname.startsWith("/dashboard/admin") && !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL(getDashboardRedirect(role), nextUrl));
    }

    if (nextUrl.pathname.startsWith("/dashboard/super-admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL(getDashboardRedirect(role), nextUrl));
    }
  }

  // Redirect already authenticated users trying to hit login/register pages
  if (isLoggedIn && (isUserLogin || isRegister || isInternalLogin)) {
    return NextResponse.redirect(new URL(getDashboardRedirect(role), nextUrl));
  }

  return NextResponse.next();
});

function getDashboardRedirect(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/dashboard/super-admin";
    case "ADMIN":
      return "/dashboard/admin";
    case "STAFF":
      return "/dashboard/staff";
    case "USER":
    default:
      return "/dashboard/user";
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/internal/login"],
};

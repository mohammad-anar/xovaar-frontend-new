import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const roll = request.cookies.get("roll")?.value;

    if (!accessToken && roll !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "?auth=admin";
      return NextResponse.redirect(url);
    }

    if (accessToken) {
      try {
        const base64Url = accessToken.split(".")[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const decoded = JSON.parse(jsonPayload);
          if (decoded.role?.toUpperCase() !== "ADMIN" && roll !== "admin") {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            url.search = "?auth=admin";
            return NextResponse.redirect(url);
          }
        }
      } catch {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.search = "?auth=admin";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

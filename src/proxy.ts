import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path.startsWith("/dashboard")) {
    if (!req.cookies.has("authjs.session-token")) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }
  }

  if (path === "/login" || path === "/register") {
    if (req.cookies.has("authjs.session-token")) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}

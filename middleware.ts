import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Si no hay token y no estamos en la página de login, redirigir al login
  if (!authToken && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token y estamos en la página de login, redirigir a la página principal
  if (authToken && isLoginPage) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // En cualquier otro caso, continuar
  return NextResponse.next();
}

// Configurar las rutas que deben ser protegidas
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

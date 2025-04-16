import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Verificar credenciales (usuario único)
    if (
      email === "compradores@sinergiacreativa.com" &&
      password === "admin12345"
    ) {
      // Crear una cookie de sesión (JWT simple para demostración)
      const token = btoa(
        JSON.stringify({
          email,
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
        })
      );

      // Establecer la cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 día
        sameSite: "strict",
      });

      return NextResponse.json({ success: true });
    }

    // Credenciales incorrectas
    return NextResponse.json(
      { success: false, message: "Credenciales inválidas" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

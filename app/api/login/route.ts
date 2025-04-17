import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Verificar credenciales (usuario único)
    if (email === "demo@fullone.com" && password === "admin12345") {
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

      return NextResponse.json({
        success: true,
        message: "Inicio de sesión exitoso",
      });
    }

    // Credenciales incorrectas - mensaje específico
    if (email !== "compradores@sinergiacreativa.com") {
      return NextResponse.json(
        {
          success: false,
          message:
            "El correo electrónico ingresado no está registrado en el sistema.",
        },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message:
            "La contraseña ingresada es incorrecta. Por favor, verifique e intente nuevamente.",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor. Por favor, intente más tarde.",
      },
      { status: 500 }
    );
  }
}

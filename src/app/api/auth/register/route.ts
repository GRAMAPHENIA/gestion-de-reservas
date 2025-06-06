import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { email, password, nombre, apellido } = await request.json();

    // 1. Primero registramos el usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "No se pudo crear el usuario" },
        { status: 400 }
      );
    }

    // 2. Luego creamos el registro en la tabla users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          nombre,
          apellido,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (userError) {
      // Si hay error al crear el usuario en la tabla users, borramos el usuario de Auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al registrar usuario" },
      { status: 500 }
    );
  }
}

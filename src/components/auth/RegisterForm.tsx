"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const registerSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  nombre: z.string().min(1, "Nombre requerido"),
  apellido: z.string().min(1, "Apellido requerido"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Error al registrarse");
      }

      // Redirigir al usuario a la página de inicio de sesión
      router.push("/inicio-de-sesion");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <div className="bg-zinc-800/30 backdrop-blur-md rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Registro</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-900/30 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
            {errors.email && (
              <p className="text-orange-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 rounded-lg bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
            {errors.password && (
              <p className="text-orange-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("nombre")}
              type="text"
              placeholder="Nombre"
              className="w-full p-3 rounded-lg bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
            {errors.nombre && (
              <p className="text-orange-600 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("apellido")}
              type="text"
              placeholder="Apellido"
              className="w-full p-3 rounded-lg bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
            {errors.apellido && (
              <p className="text-orange-600 text-sm mt-1">{errors.apellido.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/inicio-de-sesion" className="text-amber-500 hover:text-amber-400">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

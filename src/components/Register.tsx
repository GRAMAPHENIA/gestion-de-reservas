// components/Register.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !nombre || !apellido) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nombre,
          apellido
        }),
      });

      const result = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Error al registrarse");
      }

      router.push("/inicio-de-sesion");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <div className="bg-zinc-800/30 backdrop-blur-md rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Registro</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full p-3 rounded-lg bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
          </div>
          <div>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className="w-full p-3 rounded-lg bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
          </div>
          <div>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Apellido"
              className="w-full p-3 rounded-lg bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
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

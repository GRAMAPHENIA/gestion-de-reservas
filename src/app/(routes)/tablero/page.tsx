"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  // Verificar sesión al montar el componente
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (!session) {
        router.push("/inicio-de-sesion");
      }
    };
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-zinc-700/50 shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Bienvenido, {session?.user?.email}
        </h2>
        <div className="space-y-6">
          <div className="p-4 border border-zinc-700/50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Mis Alojamientos</h3>
            <p className="text-zinc-400">
              Aquí podrás gestionar tus alojamientos.
            </p>
          </div>
          <div className="p-4 border border-zinc-700/50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              Añadir Nuevo Alojamiento
            </h3>
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
              onClick={() => router.push("/dashboard/nuevo-alojamiento")}
            >
              Añadir Alojamiento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

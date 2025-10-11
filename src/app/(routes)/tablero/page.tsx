"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/inicio-de-sesion");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-stone-50 text-stone-800 p-8">Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="bg-stone-100/70 backdrop-blur-md rounded-2xl border border-stone-200/50 shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Bienvenido, {user.firstName || user.emailAddresses[0]?.emailAddress}
        </h2>
        <div className="space-y-6">
          <div className="p-4 border border-stone-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Mis Alojamientos</h3>
            <p className="text-stone-600">
              Aquí podrás gestionar tus alojamientos.
            </p>
          </div>
          <div className="p-4 border border-stone-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              Añadir Nuevo Alojamiento
            </h3>
            <button
              className="bg-stone-600 hover:bg-stone-700 text-stone-50 px-4 py-2 rounded-lg"
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

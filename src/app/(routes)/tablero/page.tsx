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
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-stone-800 mb-2">Dashboard</h1>
          <p className="text-stone-600">Bienvenido, {user.firstName || user.emailAddresses[0]?.emailAddress}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-3 text-stone-800">Mis Alojamientos</h3>
            <p className="text-stone-600 mb-6">
              Gestiona tus propiedades y reservas existentes.
            </p>
            <button className="bg-stone-700 text-white px-6 py-2 rounded font-medium hover:bg-stone-800 transition-colors">
              Ver alojamientos
            </button>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-3 text-stone-800">
              Añadir Nuevo Alojamiento
            </h3>
            <p className="text-stone-600 mb-6">
              Publica una nueva propiedad en la plataforma.
            </p>
            <button
              className="bg-stone-700 text-white px-6 py-2 rounded font-medium hover:bg-stone-800 transition-colors"
              onClick={() => router.push("/dashboard/nuevo-alojamiento")}
            >
              Añadir alojamiento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

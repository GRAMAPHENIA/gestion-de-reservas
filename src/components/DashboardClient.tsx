"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyCard from '@/components/PropertyCard';

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
};

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/inicio-de-sesion");
      return;
    }

    if (user) {
      fetchProperties(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded]);

  const fetchProperties = async (ownerId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/properties?owner_id=${ownerId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error cargando propiedades');
      setProperties(json.properties || []);
    } catch (err: unknown) {
      console.error(err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este alojamiento?')) return;
    try {
      const res = await fetch(`/api/dashboard/properties/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al eliminar');
      setProperties(p => p.filter(pt => pt.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message || 'Error');
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-stone-50 text-stone-800 p-8">Cargando...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light text-stone-800 mb-2 mt-10">TABLERO</h1>
            <p className="text-stone-600">Bienvenido, {user.firstName || user.emailAddresses[0]?.emailAddress}</p>
          </div>
          <div>
            <button
              className="bg-stone-700 text-white px-6 py-2 rounded font-medium hover:bg-stone-800 transition-colors"
              onClick={() => router.push('/tablero/nuevo-alojamiento')}
            >
              Añadir alojamiento
            </button>
          </div>
        </div>

        {loading ? (
            <div>Cargando alojamientos...</div>
          ) : properties.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-lg p-6">No hay alojamientos publicados aún.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((p) => (
                <div key={p.id} className="relative">
                  <PropertyCard property={p} />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      className="bg-white border border-stone-200 text-red-600 px-3 py-1 rounded text-sm"
                      onClick={() => handleDelete(p.id)}
                    >Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

      </div>
    </div>
  );
}

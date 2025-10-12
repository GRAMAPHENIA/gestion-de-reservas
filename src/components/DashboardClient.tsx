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
  status: 'draft' | 'published';
  owner_id: string;
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

  const handleStatusChange = (propertyId: string, newStatus: 'draft' | 'published') => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, status: newStatus }
          : prop
      )
    );
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
              onClick={() => router.push('/tablero/dashboard/nuevo-alojamiento')}
            >
              Añadir alojamiento
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-stone-600">Cargando alojamientos...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border border-stone-200 p-8">
              <h3 className="text-xl font-medium text-stone-800 mb-2">
                No tienes alojamientos aún
              </h3>
              <p className="text-stone-600 mb-6">
                Comienza agregando tu primer alojamiento para empezar a recibir reservas
              </p>
              <button
                onClick={() => router.push('/tablero/dashboard/nuevo-alojamiento')}
                className="inline-block bg-stone-700 text-white px-6 py-3 rounded-md hover:bg-stone-800 transition-colors font-medium"
              >
                Agregar mi primer alojamiento
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-stone-200">
                <h3 className="text-sm font-medium text-stone-600">Total</h3>
                <p className="text-2xl font-bold text-stone-800">{properties.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-stone-200">
                <h3 className="text-sm font-medium text-stone-600">Publicados</h3>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'published').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-stone-200">
                <h3 className="text-sm font-medium text-stone-600">Borradores</h3>
                <p className="text-2xl font-bold text-gray-600">
                  {properties.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>

            {/* Grid de propiedades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCard
                    property={property}
                    onStatusChange={handleStatusChange}
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      className="bg-white border border-stone-200 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-50 transition-colors"
                      onClick={() => handleDelete(property.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

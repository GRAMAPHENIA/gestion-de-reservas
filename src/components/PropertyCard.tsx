// components/PropertyCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

interface Property {
  id: string;
  images: string[];
  title: string;
  price: number;
  location: string;
  status?: 'draft' | 'published';
  owner_id: string;
}

interface PropertyCardProps {
  property: Property;
  onStatusChange?: (propertyId: string, newStatus: 'draft' | 'published') => void;
}

export default function PropertyCard({ property, onStatusChange }: PropertyCardProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const isOwner = user?.id === property.owner_id;

  const handleStatusChange = async (newStatus: 'draft' | 'published') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard/properties/${property.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      // Notificar al componente padre sobre el cambio
      onStatusChange?.(property.id, newStatus);
      
      // Mostrar mensaje de éxito
      const action = newStatus === 'published' ? 'publicado' : 'despublicado';
      alert(`Alojamiento ${action} exitosamente`);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado del alojamiento');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => handleStatusChange('published');
  const handleUnpublish = () => handleStatusChange('draft');
  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        {property.images[0]?.startsWith('data:') ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <Image
            src={property.images[0] || '/placeholder-image.jpg'}
            alt={property.title}
            width={400}
            height={300}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-1 text-stone-800">{property.title}</h3>
        <p className="text-stone-600 text-sm mb-4">{property.location}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-stone-800">${property.price}/noche</span>
          <div className="flex gap-2">
            {isOwner ? (
              // Botones para el propietario
              <>
                {property.status === 'draft' ? (
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Publicando...' : 'Publicar'}
                  </button>
                ) : (
                  <button
                    onClick={handleUnpublish}
                    disabled={loading}
                    className="bg-orange-600 text-white px-4 py-2 rounded font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Despublicando...' : 'Despublicar'}
                  </button>
                )}
              </>
            ) : (
              // Botón para otros usuarios
              <button className="bg-stone-700 text-white px-4 py-2 rounded font-medium hover:bg-stone-800 transition-colors">
                Reservar
              </button>
            )}
          </div>
        </div>
        {/* Indicador de estado para el propietario */}
        {isOwner && (
          <div className="mt-2 text-sm">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              property.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {property.status === 'published' ? 'Publicado' : 'Borrador'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Hook para verificar si estamos en el cliente
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  amenities: string[];
  images: string[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    guests: 1,
    location: "",
    property_type: "",
  });
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      fetchProperties();
    }
  }, [isClient]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties");
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers.get("content-type"));
      
      if (res.ok) {
        const text = await res.text();
        console.log("Response text:", text.substring(0, 200));
        
        try {
          const data = JSON.parse(text);
          setProperties(Array.isArray(data) ? data : []);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          console.error("Response was:", text);
          setError("Error al procesar la respuesta del servidor");
          setProperties([]);
        }
      } else {
        console.error("Response not ok:", res.status, res.statusText);
        const errorText = await res.text();
        console.error("Error response:", errorText);
        setError(`Error del servidor: ${res.status}`);
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Error de conexión");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    return (
      property.max_guests >= filters.guests &&
      (filters.location === "" || property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.property_type === "" || property.property_type === filters.property_type)
    );
  });

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      house: "Casa",
      apartment: "Apartamento", 
      cabin: "Cabaña",
      villa: "Villa",
      other: "Otro"
    };
    return types[type] || type;
  };

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-600">Cargando propiedades...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchProperties();
            }}
            className="bg-stone-800 text-white px-4 py-2 rounded hover:bg-stone-900"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Encuentra tu alojamiento perfecto</h1>
        
        {/* Filtros */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Huéspedes</label>
              <select
                value={filters.guests}
                onChange={(e) => setFilters({...filters, guests: parseInt(e.target.value)})}
                className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} huésped{num > 1 ? 'es' : ''}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Ubicación</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                placeholder="Buscar por ubicación..."
                className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Tipo de propiedad</label>
              <select
                value={filters.property_type}
                onChange={(e) => setFilters({...filters, property_type: e.target.value})}
                className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                <option value="">Todos los tipos</option>
                <option value="house">Casa</option>
                <option value="apartment">Apartamento</option>
                <option value="cabin">Cabaña</option>
                <option value="villa">Villa</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de propiedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
              {property.images.length > 0 && (
                <div className="relative h-48">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-stone-800 line-clamp-1">{property.title}</h3>
                  <span className="text-lg font-bold text-green-600">${property.price}/noche</span>
                </div>
                
                <p className="text-stone-600 text-sm mb-2">{property.location}</p>
                <p className="text-stone-700 text-sm mb-3 line-clamp-2">{property.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-stone-600 mb-3">
                  <span>{property.max_guests} huéspedes</span>
                  <span>{property.bedrooms} hab.</span>
                  <span>{property.bathrooms} baños</span>
                  <span>{getPropertyTypeLabel(property.property_type)}</span>
                </div>
                
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="bg-stone-100 text-stone-700 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-stone-500 text-xs">+{property.amenities.length - 3} más</span>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => router.push(`/propiedades/${property.id}`)}
                  className="w-full bg-stone-800 text-white py-2 px-4 rounded hover:bg-stone-900 transition-colors font-medium"
                >
                  Ver detalles y reservar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600">No se encontraron propiedades que coincidan con tus filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
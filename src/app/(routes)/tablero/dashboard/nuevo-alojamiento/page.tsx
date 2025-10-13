"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertyFormSchema, PropertyFormValues } from "@/schemas/propertySchema";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

export default function NewPropertyPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      images: [],
      title: "",
      description: "",
      price: 0,
      location: "",
      max_guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      property_type: "house" as const,
      amenities: []
    },
  });

  if (isLoaded && !user) {
    router.push("/inicio-de-sesion");
    return null;
  }

  const onSubmit = async (data: PropertyFormValues, shouldPublish = false) => {
    setLoading(true);
    try {
      const payload = { 
        ...data, 
        owner_id: user!.id,
        status: shouldPublish ? 'published' : 'draft'
      };
      
      const res = await fetch("/api/dashboard/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error creando propiedad');
      
      const action = shouldPublish ? 'publicado' : 'guardado como borrador';
      alert(`¡Alojamiento ${action} exitosamente!`);
      router.push('/tablero');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message || 'Error al crear alojamiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 py-12">
      <div className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-lg p-8 mt-14">
        <h1 className="text-2xl font-semibold mb-4">Añadir nuevo alojamiento</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">Título</label>
            <input 
              className="mt-1 block w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500" 
              {...register('title')} 
              placeholder="Ej: Casa frente al mar"
            />
            {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Descripción</label>
            <textarea 
              className="mt-1 block w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500" 
              {...register('description')} 
              rows={4}
              placeholder="Describe tu alojamiento..."
            />
            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Precio por noche (USD)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0"
              className="mt-1 block w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500" 
              {...register('price', { valueAsNumber: true })} 
              placeholder="100"
            />
            {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Ubicación</label>
            <input 
              className="mt-1 block w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500" 
              {...register('location')} 
              placeholder="Ej: Cancún, México"
            />
            {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">Máximo de huéspedes</label>
              <input 
                type="number" 
                min="1"
                max="20"
                className="mt-1 block w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500" 
                {...register('max_guests', { valueAsNumber: true })} 
                placeholder="4"
              />
              {errors.max_guests && <p className="text-red-600 text-sm">{errors.max_guests.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">Habitaciones</label>
              <input 
                type="number" 
                min="1"
                className="mt-1 block w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500" 
                {...register('bedrooms', { valueAsNumber: true })} 
                placeholder="2"
              />
              {errors.bedrooms && <p className="text-red-600 text-sm">{errors.bedrooms.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">Baños</label>
              <input 
                type="number" 
                min="1"
                className="mt-1 block w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500" 
                {...register('bathrooms', { valueAsNumber: true })} 
                placeholder="1"
              />
              {errors.bathrooms && <p className="text-red-600 text-sm">{errors.bathrooms.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Tipo de propiedad</label>
            <select 
              className="mt-1 block w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500" 
              {...register('property_type')}
            >
              <option value="house">Casa</option>
              <option value="apartment">Apartamento</option>
              <option value="cabin">Cabaña</option>
              <option value="villa">Villa</option>
              <option value="other">Otro</option>
            </select>
            {errors.property_type && <p className="text-red-600 text-sm">{errors.property_type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Comodidades</label>
            <Controller
              name="amenities"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    'WiFi', 'Aire acondicionado', 'Calefacción', 'Cocina', 'Lavadora', 
                    'Secadora', 'TV', 'Piscina', 'Jacuzzi', 'Gimnasio', 'Estacionamiento', 
                    'Mascotas permitidas'
                  ].map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(amenity) || false}
                        onChange={(e) => {
                          const current = field.value || [];
                          if (e.target.checked) {
                            field.onChange([...current, amenity]);
                          } else {
                            field.onChange(current.filter(a => a !== amenity));
                          }
                        }}
                        className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                      />
                      <span className="text-sm text-stone-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  images={field.value || []}
                  onChange={field.onChange}
                  maxImages={5}
                />
              )}
            />
            {errors.images && (
              <p className="text-red-600 text-sm mt-2">{errors.images.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button"
              disabled={loading} 
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit((data) => onSubmit(data, false))();
              }}
            >
              {loading ? 'Guardando...' : 'Guardar borrador'}
            </button>
            <button 
              type="button"
              disabled={loading} 
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit((data) => onSubmit(data, true))();
              }}
            >
              {loading ? 'Publicando...' : 'Publicar alojamiento'}
            </button>
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="text-stone-700 px-4 py-3 hover:bg-stone-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

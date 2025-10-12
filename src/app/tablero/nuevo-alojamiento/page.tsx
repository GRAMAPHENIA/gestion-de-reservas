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
      location: ""
    },
  });

  if (isLoaded && !user) {
    router.push("/inicio-de-sesion");
    return null;
  }

  console.log('🏠 Componente renderizado. Usuario:', user?.id);
  console.log('📝 Errores actuales:', errors);

  const onSubmit = async (data: PropertyFormValues) => {
    console.log('🚀 onSubmit ejecutado!');
    console.log('Formulario enviado con datos:', data);
    console.log('Errores del formulario:', errors);
    setLoading(true);
    try {
      const payload = { ...data, owner_id: user!.id };
      console.log('Payload a enviar:', payload);
      
      const res = await fetch("/api/dashboard/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log('Respuesta del servidor:', res.status, res.statusText);
      const json = await res.json();
      console.log('JSON de respuesta:', json);
      
      if (!res.ok) throw new Error(json.error || 'Error creando propiedad');

      // Mostrar mensaje de éxito y redirigir a la home para ver la propiedad publicada
      alert('¡Alojamiento publicado exitosamente!');
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error completo:', err);
      alert(message || 'Error al crear alojamiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 py-12">
      <div className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-lg p-8 mt-14 ">
        <h1 className="text-2xl font-semibold mb-4">Añadir nuevo alojamiento</h1>
        <form 
          onSubmit={(e) => {
            console.log('📋 Form onSubmit event triggered');
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
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
              type="submit" 
              disabled={loading} 
              className="bg-stone-700 text-white px-6 py-3 rounded-md hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              onClick={(e) => {
                console.log('🔥 Botón clickeado!', e);
                console.log('Loading state:', loading);
              }}
            >
              {loading ? 'Guardando...' : 'Publicar alojamiento'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                console.log('❌ Cancelar clickeado');
                router.back();
              }} 
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

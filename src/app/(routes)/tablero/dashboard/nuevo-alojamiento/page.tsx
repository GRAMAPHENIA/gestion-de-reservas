"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, PropertyFormValues } from "@/schemas/propertySchema";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPropertyPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: { images: [""] as unknown as string[] },
  });

  if (isLoaded && !user) {
    router.push("/inicio-de-sesion");
    return null;
  }

  const onSubmit = async (data: PropertyFormValues) => {
    setLoading(true);
    try {
      const payload = { ...data, owner_id: user!.id };
      const res = await fetch("/api/dashboard/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error creando propiedad');
      router.push('/tablero');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 py-12">
      <div className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-lg p-8">
        <h1 className="text-2xl font-semibold mb-4">Añadir nuevo alojamiento</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">Título</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" {...register('title')} />
            {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Descripción</label>
            <textarea className="mt-1 block w-full border rounded px-3 py-2" {...register('description')} />
            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Precio por noche (USD)</label>
            <input type="number" step="0.01" className="mt-1 block w-full border rounded px-3 py-2" {...register('price', { valueAsNumber: true })} />
            {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Ubicación</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" {...register('location')} />
            {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Imágenes (URLs, separadas por coma)</label>
            <input
              className="mt-1 block w-full border rounded px-3 py-2"
              {...register('images', {
                setValueAs: (v) => (typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v),
              })}
            />
            {errors.images && (
              <p className="text-red-600 text-sm">{((errors.images as unknown) as { message?: string })?.message ?? String(errors.images)}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="bg-stone-700 text-white px-4 py-2 rounded">
              {loading ? 'Guardando...' : 'Publicar alojamiento'}
            </button>
            <button type="button" onClick={() => router.back()} className="text-stone-700 px-3 py-2">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

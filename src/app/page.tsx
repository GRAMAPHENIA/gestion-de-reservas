// app/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import PropertyCard from "@/components/PropertyCard";
import { createClient } from "@/utils/supabase/client";
import { useBookingStore } from "@/store/useBookingStore";

const bookingSchema = z.object({
  location: z.string().min(1, "Ubicación requerida"),
  checkIn: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Fecha inválida"),
  checkOut: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Fecha inválida"),
  guests: z.number().min(1, "Al menos un huésped"),
});

type FormValues = z.infer<typeof bookingSchema>;

interface Property {
  id: string;
  title: string;
  price: number;
  images: string[];
  amenities?: string[];
  location: string;
}

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = createClient();
  const setFilters = useBookingStore((state) => state.setFilters);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setFilters({
      location: data.location,
      dates: [new Date(data.checkIn), new Date(data.checkOut)],
      guests: data.guests,
    });

    setLoading(true);
    setError(null);

    try {
      const { data: props, error } = await supabase
        .from("properties")
        .select("*")
        .ilike("location", `%${data.location}%`);

      if (error) throw error;
      setProperties(props ?? []);
    } catch (err: any) {
      setError(err.message || "Error al cargar propiedades");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-700">
      <main className="p-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold my-20 text-center text-stone-700 drop-shadow-md">
          Reserva tu alojamiento
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-stone-100/70 backdrop-blur-md rounded-2xl border border-stone-200/50 shadow-xl p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div>
            <input
              {...register("location")}
              placeholder="Ubicación"
              className="bg-stone-50 border-stone-300 text-stone-700 placeholder-stone-500 focus:border-stone-400 focus:ring-stone-400"
            />
            {errors.location && (
              <p className="text-stone-600 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <input type="date" {...register("checkIn")} className="bg-stone-50 border-stone-300 text-stone-700 focus:border-stone-400 focus:ring-stone-400" />
            {errors.checkIn && (
              <p className="text-stone-600 text-sm mt-1">
                {errors.checkIn.message}
              </p>
            )}
          </div>

          <div>
            <input type="date" {...register("checkOut")} className="bg-stone-50 border-stone-300 text-stone-700 focus:border-stone-400 focus:ring-stone-400" />
            {errors.checkOut && (
              <p className="text-stone-600 text-sm mt-1">
                {errors.checkOut.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              {...register("guests", { valueAsNumber: true })}
              min={1}
              className="bg-stone-50 border-stone-300 text-stone-700 focus:border-stone-400 focus:ring-stone-400"
              placeholder="Huéspedes"
            />
            {errors.guests && (
              <p className="text-stone-600 text-sm mt-1">
                {errors.guests.message}
              </p>
            )}
          </div>

          <div className="md:col-span-4 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-stone-600 hover:bg-stone-700 text-stone-50 px-8 py-2 rounded-lg shadow-lg transition"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Mensajes de estado */}
        {loading && (
          <p className="text-center text-stone-600">Cargando propiedades...</p>
        )}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && properties.length === 0 && (
          <p className="text-center text-stone-500">
            No se encontraron propiedades.
          </p>
        )}

        {/* Grid responsive de propiedades */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>
      </main>
    </div>
  );
}

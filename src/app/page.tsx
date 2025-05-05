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
    <div className="min-h-screen bg-zinc-900 text-white">
      <main className="p-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold my-20 text-center text-white drop-shadow-md">
          Reserva tu alojamiento
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-zinc-700/50 shadow-xl p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div>
            <input
              {...register("location")}
              placeholder="Ubicación"
              className="bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-zinc-500 focus:ring-zinc-500"
            />
            {errors.location && (
              <p className="text-orange-600 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <input type="date" {...register("checkIn")} className="input" />
            {errors.checkIn && (
              <p className="text-orange-600 text-sm mt-1">
                {errors.checkIn.message}
              </p>
            )}
          </div>

          <div>
            <input type="date" {...register("checkOut")} className="input" />
            {errors.checkOut && (
              <p className="text-orange-600 text-sm mt-1">
                {errors.checkOut.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              {...register("guests", { valueAsNumber: true })}
              min={1}
              className="input"
              placeholder="Huéspedes"
            />
            {errors.guests && (
              <p className="text-orange-600 text-sm mt-1">
                {errors.guests.message}
              </p>
            )}
          </div>

          <div className="md:col-span-4 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-lg shadow-lg transition"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Mensajes de estado */}
        {loading && (
          <p className="text-center text-white/80">Cargando propiedades...</p>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}
        {!loading && properties.length === 0 && (
          <p className="text-center text-white/60">
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

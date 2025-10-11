// app/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import PropertyCard from "@/components/PropertyCard";
import { createClient } from "@/utils/supabase/client";
import { useBookingStore } from "@/store/useBookingStore";
import Testimonials from "@/components/Testimonials";

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
    <div className="min-h-screen text-stone-700">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg')"}}>
        <div className="absolute inset-0 bg-black/45"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-4 tracking-tight leading-tight">Reserva tu alojamiento</h1>
          <p className="text-lg md:text-2xl mb-8 text-white/90">Encuentra el lugar perfecto para tu próxima aventura</p>
        </div>
      </section>

      {/* Search Form */}
      <main className="px-6 py-16 max-w-7xl mx-auto -mt-32 relative z-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-stone-200 shadow-lg p-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 rounded-lg"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Ubicación</label>
            <input
              {...register("location")}
              placeholder="¿Dónde quieres ir?"
              className="w-full bg-white border border-stone-300 text-stone-700 placeholder-stone-400 focus:border-stone-500 focus:ring-0 px-4 py-3 rounded-md"
            />
            {errors.location && (
              <p className="text-stone-600 text-sm">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Check-in</label>
            <input type="date" {...register("checkIn")} className="w-full bg-white border border-stone-300 text-stone-700 focus:border-stone-500 focus:ring-0 px-4 py-3 rounded-md" />
            {errors.checkIn && (
              <p className="text-stone-600 text-sm">
                {errors.checkIn.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Check-out</label>
            <input type="date" {...register("checkOut")} className="w-full bg-white border border-stone-300 text-stone-700 focus:border-stone-500 focus:ring-0 px-4 py-3 rounded-md" />
            {errors.checkOut && (
              <p className="text-stone-600 text-sm">
                {errors.checkOut.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Huéspedes</label>
            <input
              type="number"
              {...register("guests", { valueAsNumber: true })}
              min={1}
              className="w-full bg-white border border-stone-300 text-stone-700 focus:border-stone-500 focus:ring-0 px-4 py-3 rounded-md"
              placeholder="1"
            />
            {errors.guests && (
              <p className="text-stone-600 text-sm">
                {errors.guests.message}
              </p>
            )}
          </div>

          <div className="md:col-span-4 flex justify-center mt-6">
            <button
              type="submit"
              className="bg-stone-700 hover:bg-stone-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
            >
              Buscar alojamientos
            </button>
          </div>
        </form>

        {/* Mensajes de estado */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-stone-600">Cargando propiedades...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {!loading && properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 text-lg">
              No se encontraron propiedades para tu búsqueda.
            </p>
          </div>
        )}

        {/* Grid responsive de propiedades */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>

        {/* Testimonials / Partners */}
        <div className="mt-20">
          <Testimonials />
        </div>
      </main>
    </div>
  );
}

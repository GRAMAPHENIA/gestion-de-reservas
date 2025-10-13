"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingFormSchema, BookingFormValues } from "@/schemas/bookingSchema";
import Image from "next/image";

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

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      property_id: params.id as string,
      guests: 1,
      guest_name: "",
      guest_email: "",
      guest_phone: "",
      check_in: "",
      check_out: "",
      special_requests: "",
    },
  });

  const checkIn = watch("check_in");
  const checkOut = watch("check_out");

  useEffect(() => {
    const fetchProperty = async () => {
      if (!params.id) return;
      
      try {
        const res = await fetch(`/api/properties/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
        } else {
          router.push("/propiedades");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        router.push("/propiedades");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id, router]);



  const calculateTotalPrice = () => {
    if (!property || !checkIn || !checkOut) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * property.price : 0;
  };

  const onSubmit = async (data: BookingFormValues) => {
    setBookingLoading(true);
    try {
      const totalPrice = calculateTotalPrice();
      
      const bookingData = {
        ...data,
        total_price: totalPrice,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Error al crear la reserva");
      }

      alert("¡Reserva creada exitosamente! Te contactaremos pronto para confirmar los detalles.");
      router.push("/propiedades");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear la reserva";
      alert(message);
    } finally {
      setBookingLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-600">Cargando propiedad...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-600">Propiedad no encontrada</div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 text-stone-600 hover:text-stone-800 flex items-center gap-2"
        >
          ← Volver a propiedades
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de la propiedad */}
          <div className="lg:col-span-2">
            {/* Galería de imágenes */}
            {property.images.length > 0 && (
              <div className="mb-6">
                <div className="relative h-96 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={property.images[selectedImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {property.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 w-20 flex-shrink-0 rounded overflow-hidden ${
                          selectedImageIndex === index ? "ring-2 ring-stone-500" : ""
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
              <h1 className="text-3xl font-bold text-stone-800 mb-2">{property.title}</h1>
              <p className="text-stone-600 mb-4">{property.location}</p>
              
              <div className="flex items-center gap-6 text-stone-700 mb-6">
                <span>{property.max_guests} huéspedes</span>
                <span>{property.bedrooms} habitaciones</span>
                <span>{property.bathrooms} baños</span>
                <span>{getPropertyTypeLabel(property.property_type)}</span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-stone-800 mb-3">Descripción</h2>
                <p className="text-stone-700 leading-relaxed">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-stone-800 mb-3">Comodidades</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-stone-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200 sticky top-8">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-green-600">${property.price}</span>
                <span className="text-stone-600"> / noche</span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Entrada</label>
                    <input
                      type="date"
                      {...register("check_in")}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                    {errors.check_in && <p className="text-red-600 text-xs mt-1">{errors.check_in.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Salida</label>
                    <input
                      type="date"
                      {...register("check_out")}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    />
                    {errors.check_out && <p className="text-red-600 text-xs mt-1">{errors.check_out.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Huéspedes</label>
                  <select
                    {...register("guests", { valueAsNumber: true })}
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  >
                    {Array.from({ length: property.max_guests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} huésped{num > 1 ? 'es' : ''}</option>
                    ))}
                  </select>
                  {errors.guests && <p className="text-red-600 text-xs mt-1">{errors.guests.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    {...register("guest_name")}
                    placeholder="Tu nombre completo"
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  />
                  {errors.guest_name && <p className="text-red-600 text-xs mt-1">{errors.guest_name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    {...register("guest_email")}
                    placeholder="tu@email.com"
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  />
                  {errors.guest_email && <p className="text-red-600 text-xs mt-1">{errors.guest_email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    {...register("guest_phone")}
                    placeholder="+1234567890"
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  />
                  {errors.guest_phone && <p className="text-red-600 text-xs mt-1">{errors.guest_phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Solicitudes especiales (opcional)</label>
                  <textarea
                    {...register("special_requests")}
                    rows={3}
                    placeholder="Alguna solicitud especial..."
                    className="w-full border border-stone-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  />
                </div>

                {totalPrice > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-stone-700 mb-2">
                      <span>${property.price} x {nights} noche{nights > 1 ? 's' : ''}</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-stone-800">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={bookingLoading || totalPrice === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {bookingLoading ? "Procesando..." : "Reservar ahora"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
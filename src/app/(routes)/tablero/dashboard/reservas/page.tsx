"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  property_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  property: {
    title: string;
    location: string;
  };
}

export default function BookingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchBookings();
    }
  }, [isLoaded, user]);

  if (isLoaded && !user) {
    router.push("/inicio-de-sesion");
    return null;
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/dashboard/bookings?owner_id=${user!.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/dashboard/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus as any }
            : booking
        ));
        alert("Estado de reserva actualizado");
      } else {
        alert("Error al actualizar la reserva");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error al actualizar la reserva");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-600">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800">Reservas de mis propiedades</h1>
          <button
            onClick={() => router.push('/tablero')}
            className="text-stone-600 hover:text-stone-800 flex items-center gap-2"
          >
            ← Volver al dashboard
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-stone-600">No tienes reservas aún.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-stone-800 mb-2">
                      {booking.property.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-2">{booking.property.location}</p>
                    
                    <div className="space-y-1 text-sm text-stone-700">
                      <p><strong>Huésped:</strong> {booking.guest_name}</p>
                      <p><strong>Email:</strong> {booking.guest_email}</p>
                      <p><strong>Teléfono:</strong> {booking.guest_phone}</p>
                      <p><strong>Huéspedes:</strong> {booking.guests}</p>
                    </div>

                    {booking.special_requests && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-stone-700">Solicitudes especiales:</p>
                        <p className="text-sm text-stone-600">{booking.special_requests}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium text-stone-700">Entrada</p>
                        <p className="text-stone-600">{formatDate(booking.check_in)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-stone-700">Salida</p>
                        <p className="text-stone-600">{formatDate(booking.check_out)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-stone-700">Total</p>
                        <p className="text-lg font-bold text-green-600">${booking.total_price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>

                    {booking.status === 'pending' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="w-full bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Marcar completada
                      </button>
                    )}

                    <p className="text-xs text-stone-500">
                      Creada: {formatDate(booking.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
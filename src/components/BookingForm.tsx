// components/BookingForm.tsx
// Formulario de búsqueda/reserva usando React Hook Form y validación con Zod

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormValues } from "@/schemas/bookingSchema";

const BookingForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = (data: BookingFormValues) => {
    console.log("Datos del formulario:", data);
    // Aquí puedes integrar con Zustand o llamar a servicios Supabase
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4">
      <label className="block">
        <span className="text-gray-700">Fecha entrada</span>
        <input
          type="date"
          {...register("dates.0", { valueAsDate: true })}
          className="input"
        />
        {errors.dates?.[0] && <p className="text-red-500">{errors.dates[0].message}</p>}
      </label>

      <label className="block">
        <span className="text-gray-700">Fecha salida</span>
        <input
          type="date"
          {...register("dates.1", { valueAsDate: true })}
          className="input"
        />
        {errors.dates?.[1] && <p className="text-red-500">{errors.dates[1].message}</p>}
      </label>

      <label className="block">
        <span className="text-gray-700">Huéspedes</span>
        <input
          type="number"
          {...register("guests")}
          min={1}
          max={10}
          className="input"
        />
        {errors.guests && <p className="text-red-500">{errors.guests.message}</p>}
      </label>

      <label className="block">
        <span className="text-gray-700">Peticiones especiales</span>
        <textarea
          {...register("specialRequests")}
          className="input"
          rows={3}
          placeholder="Opcional"
        />
      </label>

      <button type="submit" className="btn-primary w-full py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition">
        Reservar
      </button>
    </form>
  );
};

export default BookingForm;

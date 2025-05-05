// components/SearchForm.tsx
// Formulario de búsqueda simple usando React Hook Form (sin Zod) para filtros

import { useForm, SubmitHandler } from "react-hook-form";
import { useBookingStore } from "@/store/useBookingStore";

type SearchFormValues = {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

const SearchForm = () => {
  const { setFilters } = useBookingStore.getState();
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormValues>();

  const onSubmit: SubmitHandler<SearchFormValues> = data => {
    setFilters({
      location: data.location,
      dates: [new Date(data.checkIn), new Date(data.checkOut)],
      guests: data.guests,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto p-4">
      <input
        {...register("location", { required: "La ubicación es obligatoria" })}
        placeholder="Ubicación"
        className="input"
      />
      {errors.location && <p className="text-red-500">{errors.location.message}</p>}

      <input
        type="date"
        {...register("checkIn", { required: "Fecha de entrada requerida" })}
        className="input"
      />
      {errors.checkIn && <p className="text-red-500">{errors.checkIn.message}</p>}

      <input
        type="date"
        {...register("checkOut", { required: "Fecha de salida requerida" })}
        className="input"
      />
      {errors.checkOut && <p className="text-red-500">{errors.checkOut.message}</p>}

      <input
        type="number"
        {...register("guests", { required: "Número de huéspedes requerido", min: 1 })}
        className="input"
        min={1}
      />
      {errors.guests && <p className="text-red-500">{errors.guests.message}</p>}

      <button type="submit" className="btn-primary w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
        Buscar
      </button>
    </form>
  );
};

export default SearchForm;

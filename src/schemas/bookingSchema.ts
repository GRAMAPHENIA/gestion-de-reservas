import { z } from "zod";

// Schema para crear una nueva reserva
export const bookingFormSchema = z.object({
  property_id: z.string().min(1, "ID de propiedad requerido"),
  check_in: z.string().min(1, "Fecha de entrada requerida"),
  check_out: z.string().min(1, "Fecha de salida requerida"),
  guests: z.number().min(1, "Debe haber al menos 1 huésped"),
  guest_name: z.string().min(2, "Nombre del huésped requerido"),
  guest_email: z.string().email("Email válido requerido"),
  guest_phone: z.string().min(10, "Teléfono válido requerido"),
  special_requests: z.string().optional(),
}).refine((data) => {
  const checkIn = new Date(data.check_in);
  const checkOut = new Date(data.check_out);
  return checkOut > checkIn;
}, {
  message: "La fecha de salida debe ser posterior a la fecha de entrada",
  path: ["check_out"],
});

// Schema completo para la API
export const bookingSchema = z.object({
  property_id: z.string(),
  user_id: z.string().optional(), // Para usuarios registrados
  check_in: z.string(),
  check_out: z.string(),
  guests: z.number().min(1),
  guest_name: z.string(),
  guest_email: z.string().email(),
  guest_phone: z.string(),
  special_requests: z.string().optional(),
  total_price: z.number().min(0),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).default('pending'),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type BookingValues = z.infer<typeof bookingSchema>;
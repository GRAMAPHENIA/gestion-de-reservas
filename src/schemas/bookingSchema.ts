// schemas/bookingSchema.ts
// Esquema de validación con Zod para formulario de reserva

import { z } from "zod";

export const bookingSchema = z.object({
  dates: z.tuple([z.date(), z.date()]),
  guests: z.number().min(1).max(10),
  specialRequests: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

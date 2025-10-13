import { z } from "zod";

// Schema para el formulario (sin owner_id)
export const propertyFormSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  location: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
  images: z.array(z.string()).min(1, "Se requiere al menos una imagen"),
  max_guests: z.number().min(1, "Debe permitir al menos 1 huésped").max(20, "Máximo 20 huéspedes"),
  bedrooms: z.number().min(1, "Debe tener al menos 1 habitación"),
  bathrooms: z.number().min(1, "Debe tener al menos 1 baño"),
  property_type: z.enum(['house', 'apartment', 'cabin', 'villa', 'other'], {
    errorMap: () => ({ message: "Selecciona un tipo de propiedad válido" })
  }),
  amenities: z.array(z.string()).optional(),
});

// Schema completo para la API (con owner_id)
export const propertySchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().min(0),
  location: z.string().min(3),
  images: z.array(z.string()).min(1, "Se requiere al menos una imagen"),
  max_guests: z.number().min(1).max(20),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  property_type: z.enum(['house', 'apartment', 'cabin', 'villa', 'other']),
  amenities: z.array(z.string()).optional(),
  // owner_id puede ser un UUID o un string de proveedor externo (p.ej. Clerk -> "user_xxx")
  owner_id: z.string(),
  // Estado de la propiedad: 'draft' o 'published'
  status: z.enum(['draft', 'published']).default('draft'),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
export type PropertyValues = z.infer<typeof propertySchema>;


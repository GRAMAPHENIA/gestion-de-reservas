// utils/supabase/client.ts
// Cliente Supabase singleton para evitar múltiples instancias

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 

// Crear una sola instancia del cliente
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export const createClient = () => {
  // Si ya existe una instancia, devolverla
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  // Crear nueva instancia solo si no existe
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

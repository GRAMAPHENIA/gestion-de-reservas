// hooks/useSupabase.ts
// Hook personalizado para usar Supabase de manera consistente

import { useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

export const useSupabase = () => {
  // Usar useMemo para asegurar que la instancia no cambie entre renders
  const supabase = useMemo(() => createClient(), []);
  
  return supabase;
};
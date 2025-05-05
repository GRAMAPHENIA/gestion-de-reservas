// services/bookingService.ts
// Función para crear una reserva en Supabase

import { createClient } from '@/utils/supabase/client';

interface BookingData {
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
}

export const bookProperty = async (bookingData: BookingData) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

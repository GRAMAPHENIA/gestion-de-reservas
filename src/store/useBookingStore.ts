// store/useBookingStore.ts
// Zustand store para manejar filtros de búsqueda y estado de reservas

import { create } from 'zustand';

interface BookingState {
  searchFilters: {
    location: string;
    dates: [Date?, Date?];
    guests: number;
  };
  setFilters: (filters: Partial<BookingState['searchFilters']>) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  searchFilters: {
    location: '',
    dates: [undefined, undefined],
    guests: 1
  },
  setFilters: (filters: Partial<BookingState['searchFilters']>) => set((state: BookingState) => ({
    searchFilters: { ...state.searchFilters, ...filters }
  }))
}));

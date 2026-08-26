// src/store/reservaStore.ts

import { create } from 'zustand'

interface ReservaState {
  reservaAtual: {
    mesa_id?: number
    data_hora?: string
    numero_pessoas?: number
  } | null
  setReserva: (data: { mesa_id: number; data_hora: string; numero_pessoas: number }) => void
  limparReserva: () => void
}

export const useReservaStore = create<ReservaState>((set) => ({
  reservaAtual: null,

  setReserva: (data) => set({ reservaAtual: data }),

  limparReserva: () => set({ reservaAtual: null }),
}))
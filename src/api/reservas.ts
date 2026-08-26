// src/api/reservas.ts

import { apiClient } from './client'
import type { Reserva, ReservaCreate, ReservaFiltros } from '@/types/reserva.types'

export const reservasApi = {
  listar: async (filtros?: ReservaFiltros) => {
    const params = new URLSearchParams()
    if (filtros?.status_reserva) params.append('status_reserva', filtros.status_reserva)
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio)
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim)
    if (filtros?.limit) params.append('limit', String(filtros.limit))
    if (filtros?.offset) params.append('offset', String(filtros.offset))

    const response = await apiClient.get<Reserva[]>(`/reservas/?${params}`)
    return response.data
  },

  minhasReservas: async (status?: string) => {
    const params = new URLSearchParams()
    if (status) params.append('status_reserva', status)

    const response = await apiClient.get<Reserva[]>(`/reservas/listar/minhas?${params}`)
    return response.data
  },

  buscarPorPublicId: async (publicId: string) => {
    const response = await apiClient.get<Reserva>(`/reservas/${publicId}`)
    return response.data
  },

  criar: async (data: ReservaCreate) => {
    const response = await apiClient.post<Reserva>('/reservas/', data)
    return response.data
  },

  atualizar: async (publicId: string, data: Partial<Reserva>) => {
    const response = await apiClient.put<Reserva>(`/reservas/${publicId}`, data)
    return response.data
  },

  cancelar: async (publicId: string) => {
    const response = await apiClient.patch<{ message: string; reserva_id: number; status: string }>(
      `/reservas/${publicId}/cancelar`
    )
    return response.data
  },

  reservasPorMesa: async (mesaId: number, dataInicio?: string, dataFim?: string) => {
    const params = new URLSearchParams()
    if (dataInicio) params.append('data_inicio', dataInicio)
    if (dataFim) params.append('data_fim', dataFim)

    const response = await apiClient.get<Reserva[]>(`/reservas/mesa/${mesaId}?${params}`)
    return response.data
  },
}
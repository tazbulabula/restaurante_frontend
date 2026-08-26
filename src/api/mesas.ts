// src/api/mesas.ts

import { apiClient } from './client'
import type { Mesa, MesaFiltros, VerificarDisponibilidadeRequest, MesaDisponivel } from '@/types/mesa.types'

export const mesasApi = {
  listar: async (filtros?: MesaFiltros) => {
    const params = new URLSearchParams()
    if (filtros?.status_mesa) params.append('status_mesa', filtros.status_mesa)
    if (filtros?.tipo) params.append('tipo', filtros.tipo)
    if (filtros?.disponivel !== undefined) params.append('disponivel', String(filtros.disponivel))
    if (filtros?.limit) params.append('limit', String(filtros.limit))
    if (filtros?.offset) params.append('offset', String(filtros.offset))

    const response = await apiClient.get<Mesa[]>(`/mesas/?${params}`)
    return response.data
  },

  buscarPorId: async (id: number) => {
    const response = await apiClient.get<Mesa>(`/mesas/${id}`)
    return response.data
  },

  buscarPorPublicId: async (publicId: string) => {
    const response = await apiClient.get<Mesa>(`/mesas/public/${publicId}`)
    return response.data
  },

  buscarPorNumero: async (numero: number) => {
    const response = await apiClient.get<Mesa>(`/mesas/numero/${numero}`)
    return response.data
  },

  verificarDisponibilidade: async (data: VerificarDisponibilidadeRequest) => {
    const response = await apiClient.post<{ disponivel: boolean; mesas_disponiveis: MesaDisponivel[] }>(
      '/mesas/disponibilidade',
      data
    )
    return response.data
  },

  criar: async (data: Omit<Mesa, 'id' | 'public_id' | 'status' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post<Mesa>('/mesas/', data)
    return response.data
  },

  atualizar: async (publicId: string, data: Partial<Mesa>) => {
    const response = await apiClient.put<Mesa>(`/mesas/${publicId}`, data)
    return response.data
  },

  deletar: async (publicId: string) => {
    await apiClient.delete(`/mesas/${publicId}`)
  },

  alterarStatus: async (publicId: string, novoStatus: string) => {
    const response = await apiClient.patch<Mesa>(`/mesas/${publicId}/status?novo_status=${novoStatus}`)
    return response.data
  },
}
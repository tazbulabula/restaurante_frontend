// src/api/pedidos.ts

import { apiClient } from './client'
import type { Pedido, PedidoCreate, PedidoFiltros } from '@/types/pedido.types'

export const pedidosApi = {
  listar: async (filtros?: PedidoFiltros) => {
    const params = new URLSearchParams()
    if (filtros?.status) params.append('status', filtros.status)
    if (filtros?.origem) params.append('origem', filtros.origem)
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio)
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim)
    if (filtros?.limit) params.append('limit', String(filtros.limit))
    if (filtros?.offset) params.append('offset', String(filtros.offset))

    const response = await apiClient.get<Pedido[]>(`/pedidos/?${params}`)
    return response.data
  },

  meusPedidos: async (status?: string) => {
    const params = new URLSearchParams()
    if (status) params.append('status_pedido', status)

    const response = await apiClient.get<Pedido[]>(`/pedidos/listar/meus?${params}`)
    return response.data
  },

  buscarPorPublicId: async (publicId: string) => {
    const response = await apiClient.get<Pedido>(`/pedidos/${publicId}`)
    return response.data
  },

  criar: async (data: PedidoCreate) => {
    const response = await apiClient.post<Pedido>('/pedidos/', data)
    return response.data
  },

  atualizar: async (publicId: string, data: Partial<Pedido>) => {
    const response = await apiClient.put<Pedido>(`/pedidos/${publicId}`, data)
    return response.data
  },

  atualizarStatus: async (publicId: string, status: string) => {
    const response = await apiClient.patch<Pedido>(`/pedidos/${publicId}/status`, { status })
    return response.data
  },

  cancelar: async (publicId: string) => {
    const response = await apiClient.patch<Pedido>(`/pedidos/${publicId}/cancelar`)
    return response.data
  },

  pagamentoManual: async (publicId: string, metodo: string) => {
    console.log(publicId)
    const response = await apiClient.patch(`/pedidos/${publicId}/pagamento-manual`, {
        metodo,
        observacao: `Pagamento manual via ${metodo}`,
    })
    return response.data
  },

  atualizarMetodoPagamento: async (publicId: string, metodo: string) => {
        
    const response = await apiClient.patch(`/pedidos/${publicId}/metodo-pagamento`, {
        metodo,
      })
    return response.data
  },

  selecionarMetodoPagamento: async (publicId: string, metodo: string) => {
    const response = await apiClient.patch(`/pedidos/${publicId}/metodo-pagamento`, {
    metodo,
  })
  return response.data
},

}
// src/api/produtos.ts

import { apiClient } from './client'
import type { Produto } from '@/types/produto.types'

interface ProdutoFilters {
  categoria?: string
  disponivel?: boolean
  limit?: number
  offset?: number
}

export const produtosApi = {
  listar: async (filters?: ProdutoFilters) => {
    const params = new URLSearchParams()
    if (filters?.categoria) params.append('categoria', filters.categoria)
    if (filters?.disponivel !== undefined) params.append('disponivel', String(filters.disponivel))
    if (filters?.limit) params.append('limit', String(filters.limit))
    if (filters?.offset) params.append('offset', String(filters.offset))

    const response = await apiClient.get<Produto[]>(`/produtos/listar?${params}`)
    return response.data
  },

  buscarPorPublicId: async (publicId: string) => {
    const response = await apiClient.get<Produto>(`/produtos/public/${publicId}`)
    return response.data
  },

  criar: async (data: Omit<Produto, 'id' | 'public_id' | 'created_at' | 'updated_at'>) => {
    const response = await apiClient.post<Produto>('/produtos/create', data)
    return response.data
  },

  atualizar: async (publicId: string, data: Partial<Produto>) => {
    const response = await apiClient.put<Produto>(`/produtos/update/${publicId}`, data)
    return response.data
  },

  deletar: async (publicId: string) => {
    await apiClient.delete(`/produtos/delete/${publicId}`)
  },

  alternarDisponibilidade: async (publicId: string, disponivel: boolean) => {
    const response = await apiClient.patch<Produto>(
      `/produtos/${publicId}/disponibilidade?disponivel=${disponivel}`
    )
    return response.data
  },
}
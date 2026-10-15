// src/api/produtos.ts

import { apiClient } from './client'
import type { Produto, ProdutoFormData, ProdutoUpdateData } from '@/types/produto.types'

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
    if (filters?.disponivel !== undefined)
      params.append('disponivel', String(filters.disponivel))
    if (filters?.limit) params.append('limit', String(filters.limit))
    if (filters?.offset) params.append('offset', String(filters.offset))

    const response = await apiClient.get<Produto[]>(
      `/produtos/listar?${params}`
    )
    return response.data
  },

  buscarPorPublicId: async (publicId: string) => {
    const response = await apiClient.get<Produto>(`/produtos/public/${publicId}`)
    return response.data
  },

  /** Cria produto com upload de imagem opcional (multipart/form-data) */
  criar: async (data: ProdutoFormData, imagem?: File) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('price', String(data.price))
    formData.append('category', data.category)
    if (data.description) formData.append('description', data.description)
    if (data.subcategory) formData.append('subcategory', data.subcategory)
    formData.append('is_available', String(data.is_available ?? true))
    if (imagem) formData.append('image', imagem)

    const response = await apiClient.post<Produto>('/produtos/create', formData)
    
    return response.data
  },

  atualizar: async (publicId: string, data: ProdutoUpdateData) => {
    const response = await apiClient.put<Produto>(
      `/produtos/update/${publicId}`,
      data
    )
    return response.data
  },

  /** Substitui apenas a imagem do produto */
  atualizarImagem: async (publicId: string, imagem: File) => {
    const formData = new FormData()
    formData.append('image', imagem)

    const response = await apiClient.patch<Produto>(
      `/produtos/${publicId}/imagem`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
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
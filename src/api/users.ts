// src/api/users.ts

import { apiClient } from './client'
import type { User } from '@/types/auth.types'

interface UserFilters {
  search?: string
  user_type?: string
  active_only?: boolean
  limit?: number
  offset?: number
}

interface UserListResponse {
  users: User[]
  total: number
  page: number
  per_page: number
}

export const usersApi = {
  // ✅ Retorna { users: [...], total, page, per_page }
  listar: async (filters?: UserFilters) => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.user_type) params.append('user_type', filters.user_type)
    if (filters?.active_only !== undefined) params.append('active_only', String(filters.active_only))
    if (filters?.limit) params.append('limit', String(filters.limit))
    if (filters?.offset) params.append('offset', String(filters.offset))

    const response = await apiClient.get<UserListResponse>(`/users/?${params}`)
    return response.data
  },

  buscarPorPublicId: async (publicId: string) => {
    const response = await apiClient.get<User>(`/users/buscar/${publicId}`)
    return response.data
  },

  criar: async (data: { username: string; email: string; password: string; phone?: string; user_type?: string }) => {
    const response = await apiClient.post<User>('/users/create', data)
    return response.data
  },

  atualizar: async (publicId: string, data: Partial<User>) => {
    const response = await apiClient.put<User>(`/users/update/${publicId}`, data)
    return response.data
  },

  listar: async (filters?: {
    search?: string;
    user_type?: string;
    active_only?: boolean;
    include_deleted?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.user_type) params.append('user_type', filters.user_type);
    if (filters?.active_only !== undefined) params.append('active_only', String(filters.active_only));
    if (filters?.include_deleted !== undefined) params.append('include_deleted', String(filters.include_deleted));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));

    const response = await apiClient.get<UserListResponse>(`/users/?${params}`);
    return response.data;
  },

  // Listar apenas usuários deletados
  listarDeletados: async () => {
    const response = await apiClient.get<User[]>('/users/deleted');
    return response.data;
  },

  // Restaurar usuário
  restaurar: async (publicId: string) => {
    const response = await apiClient.patch<User>(`/users/${publicId}/restore`);
    return response.data;
  },

  // Deletar permanentemente
  deletarPermanentemente: async (publicId: string) => {
    await apiClient.delete(`/users/${publicId}/permanent`);
  },

  // Soft delete (já existe)
  deletar: async (publicId: string) => {
    await apiClient.delete(`/users/delete/${publicId}`);
  },

  alterarTipo: async (publicId: string, userType: string) => {
    const response = await apiClient.patch<User>(`/users/${publicId}/tipo`, { user_type: userType })
    return response.data
  },
}
// src/api/auth.ts

import { apiClient } from './client'
import type { User, LoginResponse, RegisterData } from '@/types/auth.types'

export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const response = await apiClient.post<LoginResponse>('/token/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  // Registro
  register: async (data: RegisterData) => {
    const response = await apiClient.post<User>('/users/create', data)
    return response.data
  },

  // Usuário atual
  getCurrentUser: async () => {
    const response = await apiClient.get<User>('/users/me')
    return response.data
  },

  // Refresh Token
  refreshToken: async () => {
    const response = await apiClient.post<LoginResponse>('/token/refresh_token')
    return response.data
  },

  // Alterar Senha
  changePassword: async (publicId: string, data: {
    current_password: string
    new_password: string
    confirm_password: string
  }) => {
    const response = await apiClient.patch(`/token/change_password/${publicId}`, data)
    return response.data
  },

  // Solicitar Reset de Senha
  requestPasswordReset: async (email: string) => {
    const response = await apiClient.post('/token/reset-password', { email })
    return response.data
  },

  logout: async () => {
    // Não precisa de endpoint, apenas remove o token no frontend
  },
}
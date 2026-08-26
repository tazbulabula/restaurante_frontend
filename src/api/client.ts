// src/api/client.ts

import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Interceptor para adicionar token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para tratar erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Erro de rede (servidor offline)
    if (!error.response) {
      error.userMessage = 'Erro de conexão. Verifique sua internet.'
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // Mapeia os status para mensagens amigáveis
    switch (status) {
      case 400:
        error.userMessage = data?.detail || 'Dados inválidos. Verifique e tente novamente.'
        break
      case 401:
        error.userMessage = 'Email ou senha incorretos.'
        // Se for 401, desloga o usuário
        useAuthStore.getState().logout()
        break
      case 403:
        error.userMessage = 'Você não tem permissão para realizar esta ação.'
        break
      case 404:
        error.userMessage = data?.detail || 'Recurso não encontrado.'
        break
      case 409:
        error.userMessage = data?.detail || 'Conflito com dados existentes.'
        break
      case 422:
        // Erro de validação do Pydantic
        if (data?.detail) {
          if (Array.isArray(data.detail)) {
            // Pydantic validation errors
            const messages = data.detail.map((err: any) => {
              const field = err.loc?.join('.') || 'campo'
              return `${field}: ${err.msg}`
            })
            error.userMessage = messages.join(', ')
          } else {
            error.userMessage = data.detail
          }
        } else {
          error.userMessage = 'Dados inválidos. Verifique os campos.'
        }
        break
      case 500:
        error.userMessage = 'Erro interno do servidor. Tente novamente mais tarde.'
        break
      default:
        error.userMessage = data?.detail || 'Ocorreu um erro inesperado.'
    }

    return Promise.reject(error)
  }
)
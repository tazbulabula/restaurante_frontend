// src/store/authStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/api/auth'
import type { User } from '@/types/auth.types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>  // ← Retorna User
  register: (data: { username: string; email: string; password: string; phone?: string }) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  refreshToken: () => Promise<void>
  changePassword: (publicId: string, data: { current_password: string; new_password: string; confirm_password: string }) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        set({ isLoading: true })  // ✅ Começa loading
        try {
          const response = await authApi.login(email, password)
          set({ token: response.access_token, isAuthenticated: true })

          const user = await authApi.getCurrentUser()
          set({ user, isLoading: false })  // ✅ Termina loading
          return user
        } catch (error) {
          set({ isLoading: false })  // ✅ Termina loading em erro
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          // 1. Registra
          await authApi.register(data)
          
          // 2. Faz login
          const loginResponse = await authApi.login(data.email, data.password)
          
          // 3. ✅ SALVA O TOKEN PRIMEIRO (e AGUARDA)
          set({ token: loginResponse.access_token, isAuthenticated: true })
          
          // 4. ✅ FORÇA O INTERCEPTOR A USAR O NOVO TOKEN
          // Pequeno delay para garantir que o estado foi atualizado
          await new Promise(resolve => setTimeout(resolve, 100))
          
          // 5. Busca o usuário (agora com o token disponível)
          const userData = await authApi.getCurrentUser()
          
          // 6. Atualiza o estado
          set({ user: userData, isLoading: false })
          
          return userData
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })  // Define isLoading como false
          return
        }

        try {
          const user = await authApi.getCurrentUser()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false })
        }
      },

      refreshToken: async () => {
        try {
          const response = await authApi.refreshToken()
          set({ token: response.access_token })
        } catch (error) {
          console.error('Erro ao renovar token:', error)
          get().logout()
        }
      },

      changePassword: async (publicId, data) => {
        set({ isLoading: true })
        try {
          const response = await authApi.changePassword(publicId, data)
          set({ isLoading: false })
          return response
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      requestPasswordReset: async (email) => {
        set({ isLoading: true })
        try {
          const response = await authApi.requestPasswordReset(email)
          set({ isLoading: false })
          return response
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
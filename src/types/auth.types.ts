// src/types/auth.types.ts

export interface User {
  id: number
  public_id: string
  username: string
  email: string
  phone?: string
  user_type: 'admin' | 'client'
  is_active?: boolean
  deleted_at?: string | null
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  phone?: string
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  per_page: number
}
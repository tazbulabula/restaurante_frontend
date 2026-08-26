// src/types/mesa.types.ts

export interface Mesa {
  id: number
  public_id: string
  numero: number
  capacidade: number
  status: 'disponivel' | 'reservada' | 'ocupada' | 'em_limpeza' | 'indisponivel'
  tipo: 'padrao' | 'jantar' | 'vip' | 'externa' | 'bar'
  descricao?: string
  localizacao?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MesaFiltros {
  status_mesa?: string
  tipo?: string
  disponivel?: boolean
  limit?: number
  offset?: number
}

export interface VerificarDisponibilidadeRequest {
  data_hora: string
  numero_pessoas: number
  duracao_minutos?: number
}

export interface MesaDisponivel {
  id: number
  public_id: string
  numero: number
  capacidade: number
  tipo: string
  localizacao?: string
  status: string
}
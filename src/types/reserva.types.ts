// src/types/reserva.types.ts

import type { Mesa } from './mesa.types'

export interface Reserva {
  id: number
  public_id: string
  mesa_id: number
  usuario_id?: number
  cliente_nome: string
  cliente_telefone: string
  data_hora: string
  numero_pessoas: number
  status: string
  expira_em?: string
  observacoes?: string
  pedido_id?: number
  created_at: string
  updated_at: string
  mesa?: Mesa
}

export interface ReservaCreate {
  mesa_id: number
  data_hora: string
  numero_pessoas: number
  cliente_nome: string
  cliente_telefone: string
  observacoes?: string
}

export interface ReservaFiltros {
  status_reserva?: string
  data_inicio?: string
  data_fim?: string
  limit?: number
  offset?: number
}
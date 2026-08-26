// src/types/pedido.types.ts

export interface ItemPedido {
  id?: number
  public_id?: string
  produto_id: number
  quantidade: number
  preco_unitario?: number
  subtotal?: number
  observacoes?: string
  produto?: {
    id: number
    name: string
    price: number
  }
}

export interface Pedido {
  id: number
  public_id: string
  mesa_numero: number
  cliente_nome: string
  cliente_telefone: string
  cliente_tipo: 'registrado' | 'convidado'
  total: number
  status: 'aguardando_pagamento' | 'pago' | 'preparando' | 'pronto' | 'entregue' | 'cancelado'
  origem: 'presencial' | 'delivery' | 'reserva'
  observacoes?: string
  usuario_id?: number
  reserva_mesa_id?: number
  transacao_id?: string
  pagamento_confirmado_em?: string
  codigo_autorizacao?: string
  itens: ItemPedido[]
  created_at: string
  updated_at: string
}

export interface PedidoCreate {
  mesa_numero: number
  cliente_nome: string
  cliente_telefone: string
  cliente_tipo?: 'registrado' | 'convidado'
  observacoes?: string
  origem?: 'presencial' | 'delivery' | 'reserva'
  usuario_id?: number
  reserva_mesa_id?: number
  itens: {
    produto_id: number
    quantidade: number
    observacoes?: string
  }[]
}

export interface PedidoFiltros {
  status?: string
  origem?: string
  data_inicio?: string
  data_fim?: string
  limit?: number
  offset?: number
}
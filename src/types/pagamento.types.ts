// src/types/pagamento.types.ts

export interface IniciarPagamentoRequest {
  pedido_public_id: string
  telefone: string
}

export interface IniciarPagamentoResponse {
  transacao_id: string
  pedido_id: number
  pedido_public_id: string
  valor: number
  status: string
  mensagem: string
  instrucoes: string
}

export interface StatusPagamentoResponse {
  pedido_id: number
  pedido_public_id: string
  status_pedido: string
  transacao_id?: string
  valor: number
  pagamento_confirmado_em?: string
  codigo_autorizacao?: string
  mensagem: string
}
// src/api/dashboard.ts

import { apiClient } from './client'

export interface EstatisticasGerais {
  total_produtos: number
  produtos_disponiveis: number
  total_mesas: number
  mesas_ocupadas: number
  total_pedidos: number
  pedidos_hoje: number
  receita_total: number
  receita_hoje: number
  total_reservas: number
  reservas_hoje: number
  total_clientes: number
}

export interface ProdutoPorCategoria {
  categoria: string
  total: number
  disponiveis: number
}

export interface PedidosPorDia {
  data: string // 'YYYY-MM-DD'
  total: number
}

export interface ReceitaPorDia {
  data: string // 'YYYY-MM-DD'
  total: number
}

export interface TopProdutoAPI {
  nome: string
  total: number
}

export const dashboardApi = {
  estatisticas: async () => {
    const { data } = await apiClient.get<EstatisticasGerais>(
      '/dashboard/estatisticas'
    )
    return data
  },

  produtosPorCategoria: async () => {
    const { data } = await apiClient.get<ProdutoPorCategoria[]>(
      '/dashboard/produtos-por-categoria'
    )
    return data
  },

  pedidosPorDia: async (dias = 7) => {
    const { data } = await apiClient.get<PedidosPorDia[]>(
      `/dashboard/pedidos-por-dia?dias=${dias}`
    )
    return data
  },

  receitaPorDia: async (dias = 7) => {
    const { data } = await apiClient.get<ReceitaPorDia[]>(
      `/dashboard/receita-por-dia?dias=${dias}`
    )
    return data
  },

  topProdutos: async (limite = 5) => {
    const { data } = await apiClient.get<TopProdutoAPI[]>(
      `/dashboard/top-produtos?limite=${limite}`
    )
    return data
  },
}
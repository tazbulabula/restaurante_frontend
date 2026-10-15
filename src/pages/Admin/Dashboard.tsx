// src/pages/Admin/Dashboard.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  Table,
  ShoppingBag,
  Calendar,
  Users,
  ChevronRight,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Crown,
  Utensils,
  Activity,
  Zap,
  DollarSign,
  BarChart3,
  AlertCircle,
} from 'lucide-react'
import { Container, Card, Button, Spinner, showToast } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import { mesasApi } from '@/api/mesas'
import { pedidosApi } from '@/api/pedidos'
import { reservasApi } from '@/api/reservas'
import { usersApi } from '@/api/users'
import {
  dashboardApi,
  type EstatisticasGerais,
  type ProdutoPorCategoria,
  type PedidosPorDia as PedidosPorDiaType,
  type ReceitaPorDia as ReceitaPorDiaType,
  type TopProdutoAPI,
} from '@/api/dashboard'

// Chart components
import { ProdutosPorCategoria } from '@/components/charts/ProdutosPorCategoria'
import { ReceitaPorDia } from '@/components/charts/ReceitaPorDia'
import { PedidosPorDia } from '@/components/charts/PedidosPorDia'
import { TopProdutos } from '@/components/charts/TopProdutos'

// ============================================================
// ANIMAÇÕES
// ============================================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.15, 1] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25, delay: 0.1 },
  },
  hover: {
    y: -4,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
}

const iconVariants = {
  hidden: { scale: 0, rotate: -30 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 500, damping: 30, delay: 0.2 },
  },
}

const quickActionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.15, 1], delay: 0.3 },
  },
  hover: {
    y: -6,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
}

const loadingVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.15, 1] },
  },
}

// ============================================================
// CONFIGURAÇÕES
// ============================================================
const statCards = [
  {
    key: 'produtos' as const,
    icon: <Package className="w-6 h-6" />,
    iconBg: 'bg-gold-100',
    iconColor: 'text-gold-600',
    label: 'Produtos',
    link: '/admin/produtos',
    linkLabel: 'Gerenciar',
    gradient: 'from-gold-100/30 to-gold-50/30',
  },
  {
    key: 'mesas' as const,
    icon: <Table className="w-6 h-6" />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    label: 'Mesas',
    link: '/admin/mesas',
    linkLabel: 'Gerenciar',
    gradient: 'from-blue-100/30 to-blue-50/30',
  },
  {
    key: 'pedidos' as const,
    icon: <ShoppingBag className="w-6 h-6" />,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    label: 'Pedidos',
    link: '/admin/pedidos',
    linkLabel: 'Ver Todos',
    gradient: 'from-emerald-100/30 to-emerald-50/30',
  },
  {
    key: 'reservas' as const,
    icon: <Calendar className="w-6 h-6" />,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    label: 'Reservas',
    link: '/admin/reservas',
    linkLabel: 'Ver Todas',
    gradient: 'from-purple-100/30 to-purple-50/30',
  },
  {
    key: 'clientes' as const,
    icon: <Users className="w-6 h-6" />,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    label: 'Clientes',
    link: '/admin/clientes',
    linkLabel: 'Gerenciar',
    gradient: 'from-rose-100/30 to-rose-50/30',
  },
]

const quickActions = [
  {
    icon: <Utensils className="w-6 h-6" />,
    label: 'Novo Produto',
    description: 'Adicionar ao cardápio',
    link: '/admin/produtos/criar',
    color: 'from-gold-500 to-gold-600',
  },
  {
    icon: <Table className="w-6 h-6" />,
    label: 'Nova Mesa',
    description: 'Adicionar ao restaurante',
    link: '/admin/mesas/criar',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <Users className="w-6 h-6" />,
    label: 'Novo Cliente',
    description: 'Cadastrar no sistema',
    link: '/admin/clientes/criar',
    color: 'from-rose-500 to-rose-600',
  },
]

interface DashboardData {
  stats: EstatisticasGerais
  produtosPorCategoria: ProdutoPorCategoria[]
  pedidosPorDia: PedidosPorDiaType[]
  receitaPorDia: ReceitaPorDiaType[]
  topProdutos: TopProdutoAPI[]
  usouFallback: boolean
}

const EMPTY_STATS: EstatisticasGerais = {
  total_produtos: 0,
  produtos_disponiveis: 0,
  total_mesas: 0,
  mesas_ocupadas: 0,
  total_pedidos: 0,
  pedidos_hoje: 0,
  receita_total: 0,
  receita_hoje: 0,
  total_reservas: 0,
  reservas_hoje: 0,
  total_clientes: 0,
}

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [data, setData] = useState<DashboardData>({
    stats: EMPTY_STATS,
    produtosPorCategoria: [],
    pedidosPorDia: [],
    receitaPorDia: [],
    topProdutos: [],
    usouFallback: false,
  })

  useEffect(() => {
    setIsMounted(true)
    carregarTudo()
  }, [])

  // ============================================================
  // CARREGAR DO BACKEND (/dashboard/*)
  // ============================================================
  const carregarTudo = async () => {
    setIsLoading(true)
    try {
      const [statsRes, prodCatRes, pedidosRes, receitaRes, topRes] =
        await Promise.allSettled([
          dashboardApi.estatisticas(),
          dashboardApi.produtosPorCategoria(),
          dashboardApi.pedidosPorDia(7),
          dashboardApi.receitaPorDia(7),
          dashboardApi.topProdutos(5),
        ])

      const houveFalha = [
        statsRes,
        prodCatRes,
        pedidosRes,
        receitaRes,
        topRes,
      ].some((r) => r.status === 'rejected')

      // Se TODOS falharam → tenta fallback client-side
      const todosFalharam = [
        statsRes,
        prodCatRes,
        pedidosRes,
        receitaRes,
        topRes,
      ].every((r) => r.status === 'rejected')

      if (todosFalharam) {
        console.warn('Endpoints /dashboard/* indisponíveis. A usar fallback.')
        await carregarFallback()
        return
      }

      const stats =
        statsRes.status === 'fulfilled' ? statsRes.value : EMPTY_STATS
      const produtosPorCategoria =
        prodCatRes.status === 'fulfilled' ? prodCatRes.value : []
      const pedidosPorDia =
        pedidosRes.status === 'fulfilled' ? pedidosRes.value : []
      const receitaPorDia =
        receitaRes.status === 'fulfilled' ? receitaRes.value : []
      const topProdutos = topRes.status === 'fulfilled' ? topRes.value : []

      setData({
        stats,
        produtosPorCategoria,
        pedidosPorDia,
        receitaPorDia,
        topProdutos,
        usouFallback: houveFalha,
      })
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      showToast.error('Erro ao carregar dados do painel')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================
  // FALLBACK CLIENT-SIDE (agregação local)
  // ============================================================
  const carregarFallback = async () => {
    try {
      const [produtos, mesas, pedidos, reservas, clientes] =
        await Promise.all([
          produtosApi.listar(),
          mesasApi.listar(),
          pedidosApi.listar(),
          reservasApi.listar(),
          usersApi.listar({ user_type: 'cliente' }),
        ])

      // 1. Produtos por categoria
      const mapaCat = new Map<string, { total: number; disponiveis: number }>()
      produtos.forEach((p) => {
        const entry = mapaCat.get(p.category) ?? { total: 0, disponiveis: 0 }
        entry.total++
        if (p.is_available) entry.disponiveis++
        mapaCat.set(p.category, entry)
      })

      const produtosPorCategoria: ProdutoPorCategoria[] = Array.from(
        mapaCat.entries()
      ).map(([categoria, v]) => ({
        categoria,
        total: v.total,
        disponiveis: v.disponiveis,
      }))

      // 2. Pedidos por dia (últimos 7 dias) — agrega client-side
      const hoje = new Date()
      const dias: PedidosPorDiaType[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(hoje)
        d.setDate(hoje.getDate() - i)
        d.setHours(0, 0, 0, 0)
        const amanha = new Date(d)
        amanha.setDate(d.getDate() + 1)

        const doDia = pedidos.filter((p) => {
          const data = new Date((p as any).created_at)
          return data >= d && data < amanha
        })

        dias.push({
          data: d.toISOString().slice(0, 10),
          total: doDia.length,
        })
      }

      // 3. Top produtos (a partir dos pedidos, se tiverem items)
      const contagem = new Map<string, number>()
      pedidos.forEach((p: any) => {
        if (Array.isArray(p.items)) {
          p.items.forEach((it: any) => {
            const nome = it?.produto?.name ?? it?.name
            if (!nome) return
            contagem.set(nome, (contagem.get(nome) ?? 0) + (it.quantity ?? 1))
          })
        }
      })

      const topProdutos: TopProdutoAPI[] = Array.from(contagem.entries())
        .map(([nome, total]) => ({ nome, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)

      setData({
        stats: {
          total_produtos: produtos.length,
          produtos_disponiveis: produtos.filter((p) => p.is_available).length,
          total_mesas: mesas.length,
          mesas_ocupadas: 0,
          total_pedidos: pedidos.length,
          pedidos_hoje: 0,
          receita_total: 0,
          receita_hoje: 0,
          total_reservas: reservas.length,
          reservas_hoje: 0,
          total_clientes: clientes.users?.length ?? 0,
        },
        produtosPorCategoria,
        pedidosPorDia: dias,
        receitaPorDia: [],
        topProdutos,
        usouFallback: true,
      })
    } catch (error) {
      console.error('Fallback falhou:', error)
      showToast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const statsValues = {
    produtos: data.stats.total_produtos,
    mesas: data.stats.total_mesas,
    pedidos: data.stats.total_pedidos,
    reservas: data.stats.total_reservas,
    clientes: data.stats.total_clientes,
  }

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <div className="relative inline-block">
            <Spinner size="lg" color="gold" />
          </div>
          <p className="text-brown-500 mt-4">Carregando painel...</p>
        </motion.div>
      </Container>
    )
  }

  // ============================================================
  // DASHBOARD
  // ============================================================
  return (
    <div className="min-h-screen bg-cream-50 py-8 md:py-12">
      <Container>
        {/* HEADER */}
        <motion.div
          initial="hidden"
          animate={isMounted ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Painel <span className="text-gold-500">Admin</span>
                  </h1>
                  <p className="text-brown-500 text-sm flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    Visão geral do restaurante
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={carregarFallback}
                className="border-gold-300 text-brown-600 hover:bg-gold-50/50"
                title="Agrega dados localmente (útil se o backend ainda não tiver /dashboard)"
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Modo simples
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={carregarTudo}
                className="border-gold-300 text-brown-600 hover:bg-gold-50/50"
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Atualizar
                </span>
              </Button>
            </div>
          </div>

          {data.usouFallback && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Alguns dados vieram de fallback local (backend{' '}
                <code className="px-1 bg-amber-100 rounded">
                  /dashboard/*
                </code>{' '}
                indisponível). Alguns gráficos podem estar incompletos.
              </span>
            </div>
          )}
        </motion.div>

        {/* KPIs DE RECEITA */}
        <motion.div
          initial="hidden"
          animate={isMounted ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Card className="p-5 bg-gradient-to-br from-gold-50 to-gold-100/30 border-2 border-gold-200/40">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/30">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-gold-500" />
            </div>
            <p className="text-xs text-brown-500 uppercase tracking-wider">
              Receita Total
            </p>
            <p className="text-2xl font-display font-bold text-brown-800 mt-1">
              {data.stats.receita_total.toLocaleString('pt-AO')} Kz
            </p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-2 border-emerald-200/40">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs text-brown-500 uppercase tracking-wider">
              Receita Hoje
            </p>
            <p className="text-2xl font-display font-bold text-brown-800 mt-1">
              {data.stats.receita_hoje.toLocaleString('pt-AO')} Kz
            </p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/30 border-2 border-blue-200/40">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <CheckCircle className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-xs text-brown-500 uppercase tracking-wider">
              Pedidos Hoje
            </p>
            <p className="text-2xl font-display font-bold text-brown-800 mt-1">
              {data.stats.pedidos_hoje}
            </p>
          </Card>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isMounted ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8"
        >
          {statCards.map((card) => {
            const value = statsValues[card.key] || 0

            return (
              <motion.div
                key={card.key}
                variants={statVariants}
                whileHover="hover"
              >
                <Card
                  variant="gold"
                  className={`text-center p-5 bg-gradient-to-br ${card.gradient} border-2 border-gold-200/30 shadow-lg shadow-gold-500/5 hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 h-full flex flex-col items-center justify-center`}
                >
                  <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}
                  >
                    <span className={card.iconColor}>{card.icon}</span>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      delay: 0.2,
                    }}
                    className="text-3xl font-display font-bold text-brown-800"
                  >
                    {value}
                  </motion.div>

                  <p className="text-sm text-brown-500 mt-1">{card.label}</p>

                  <Link to={card.link} className="mt-3 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gold-300 text-gold-600 hover:bg-gold-50/50 text-xs"
                    >
                      <span className="flex items-center justify-center gap-1">
                        {card.linkLabel}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* GRÁFICOS — LINHA 1 */}
        <motion.div
          initial="hidden"
          animate={isMounted ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-6"
        >
          <Card className="p-5 bg-white shadow-sm shadow-brown-900/5 border border-cream-200/50">
            <ReceitaPorDia data={data.receitaPorDia} />
          </Card>
          <Card className="p-5 bg-white shadow-sm shadow-brown-900/5 border border-cream-200/50">
            <PedidosPorDia data={data.pedidosPorDia} />
          </Card>
        </motion.div>

        {/* GRÁFICOS — LINHA 2 */}
        <motion.div
          initial="hidden"
          animate={isMounted ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-8"
        >
          <Card className="p-5 bg-white shadow-sm shadow-brown-900/5 border border-cream-200/50">
            <ProdutosPorCategoria data={data.produtosPorCategoria} />
          </Card>
          <Card className="p-5 bg-white shadow-sm shadow-brown-900/5 border border-cream-200/50">
            <TopProdutos data={data.topProdutos} />
          </Card>
        </motion.div>

        {/* AÇÕES RÁPIDAS */}
        <motion.div
          initial="hidden"
          animate={isMounted ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="mb-8"
        >
          <h2 className="text-2xl font-display text-brown-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gold-500" />
            Ações <span className="text-gold-500">Rápidas</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                variants={quickActionVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link to={action.link}>
                  <Card
                    variant="hover"
                    className="text-center py-6 cursor-pointer bg-white shadow-sm shadow-brown-900/5 border-2 border-transparent hover:border-gold-400/30 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 shadow-lg shadow-gold-500/20`}
                    >
                      <span className="text-white">{action.icon}</span>
                    </div>
                    <h3 className="font-display text-lg text-brown-800">
                      {action.label}
                    </h3>
                    <p className="text-sm text-brown-500">
                      {action.description}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM BAR */}
        <motion.div
          initial="hidden"
          animate={isMounted ? 'visible' : 'hidden'}
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <Card className="p-5 bg-white shadow-sm shadow-brown-900/5 border border-cream-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-gold-600" />
              </div>
              <h3 className="font-display text-brown-800">
                Status do Sistema
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brown-500">Produtos</span>
                <span className="font-medium text-brown-700">
                  {data.stats.produtos_disponiveis} de{' '}
                  {data.stats.total_produtos} ativos
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brown-500">Mesas</span>
                <span className="font-medium text-brown-700">
                  {data.stats.mesas_ocupadas} ocupadas /{' '}
                  {data.stats.total_mesas} total
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brown-500">Pedidos hoje</span>
                <span className="font-medium text-brown-700">
                  {data.stats.pedidos_hoje}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brown-500">Reservas hoje</span>
                <span className="font-medium text-brown-700">
                  {data.stats.reservas_hoje} de {data.stats.total_reservas}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white shadow-sm shadow-brown-900/5 border border-cream-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-display text-brown-800">Resumo Rápido</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-brown-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Sistema operacional
              </div>
              <div className="flex items-center gap-2 text-brown-600">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                {data.stats.total_produtos} produtos no cardápio
              </div>
              <div className="flex items-center gap-2 text-brown-600">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {data.stats.total_mesas} mesas registadas
              </div>
              <div className="flex items-center gap-2 text-brown-600">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                {data.stats.total_clientes} clientes cadastrados
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}
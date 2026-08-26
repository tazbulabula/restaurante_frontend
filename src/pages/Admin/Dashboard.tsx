// src/pages/Admin/Dashboard.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Button, Spinner, showToast } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import { mesasApi } from '@/api/mesas'
import { pedidosApi } from '@/api/pedidos'
import { reservasApi } from '@/api/reservas'

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    produtos: 0,
    mesas: 0,
    pedidos: 0,
    reservas: 0,
  })

  useEffect(() => {
    carregarStats()
  }, [])

  const carregarStats = async () => {
    setIsLoading(true)
    try {
      const [produtos, mesas, pedidos, reservas] = await Promise.all([
        produtosApi.listar(),
        mesasApi.listar(),
        pedidosApi.listar(),
        reservasApi.listar(),
      ])

      setStats({
        produtos: produtos.length,
        mesas: mesas.length,
        pedidos: pedidos.length,
        reservas: reservas.length,
      })
    } catch (error) {
      console.error('Erro ao carregar stats:', error)
      showToast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Container className="py-12 flex justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h1 className="text-4xl font-display text-brown-800 mb-8">👑 Painel Admin</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card variant="gold" className="text-center">
          <div className="text-3xl mb-2">🍽️</div>
          <h3 className="text-2xl font-display text-brown-800">{stats.produtos}</h3>
          <p className="text-brown-600 text-sm">Produtos</p>
          <Link to="/admin/produtos">
            <Button variant="outline-gold" size="sm" className="mt-3">
              Gerenciar
            </Button>
          </Link>
        </Card>

        <Card variant="gold" className="text-center">
          <div className="text-3xl mb-2">🪑</div>
          <h3 className="text-2xl font-display text-brown-800">{stats.mesas}</h3>
          <p className="text-brown-600 text-sm">Mesas</p>
          <Link to="/admin/mesas">
            <Button variant="outline-gold" size="sm" className="mt-3">
              Gerenciar
            </Button>
          </Link>
        </Card>

        <Card variant="gold" className="text-center">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="text-2xl font-display text-brown-800">{stats.pedidos}</h3>
          <p className="text-brown-600 text-sm">Pedidos</p>
          <Link to="/admin/pedidos">
            <Button variant="outline-gold" size="sm" className="mt-3">
                Ver Todos
            </Button>
            </Link>
        </Card>

        <Card variant="gold" className="text-center">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="text-2xl font-display text-brown-800">{stats.reservas}</h3>
          <p className="text-brown-600 text-sm">Reservas</p>
          <Link to="/admin/reservas">
            <Button variant="outline-gold" size="sm" className="mt-3">
                Ver Todas
            </Button>
            </Link>
        </Card>

        <Card variant="gold" className="text-center">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-2xl font-display text-brown-800">{stats.clientes}</h3>
          <p className="text-brown-600 text-sm">Clientes</p>
          <Link to="/admin/clientes">
            <Button variant="outline-gold" size="sm" className="mt-3">
              Gerenciar
            </Button>
          </Link>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <h2 className="text-2xl font-display text-brown-800 mb-4">⚡ Ações Rápidas</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/produtos/criar">
          <Card variant="hover" className="text-center py-6 cursor-pointer">
            <div className="text-3xl mb-2">➕</div>
            <h3 className="font-display text-brown-800">Novo Produto</h3>
            <p className="text-sm text-brown-600">Adicionar ao cardápio</p>
          </Card>
        </Link>
        <Link to="/admin/mesas/criar">
          <Card variant="hover" className="text-center py-6 cursor-pointer">
            <div className="text-3xl mb-2">➕</div>
            <h3 className="font-display text-brown-800">Nova Mesa</h3>
            <p className="text-sm text-brown-600">Adicionar ao restaurante</p>
          </Card>
        </Link>
      </div>
    </Container>
  )
}
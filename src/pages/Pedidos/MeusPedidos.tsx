// src/pages/Pedidos/MeusPedidos.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Badge, Button, Spinner, showToast, Skeleton } from '@/components/ui'
import { pedidosApi } from '@/api/pedidos'
import type { Pedido } from '@/types/pedido.types'

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  aguardando_pagamento: 'warning',
  aguardando_confirmacao_manual: 'warning',  // <--- NOVO
  pago: 'success',
  preparando: 'info',
  pronto: 'success',
  entregue: 'success',
  cancelado: 'danger',
}

const statusLabels: Record<string, string> = {
  aguardando_pagamento: 'Aguardando Pagamento',
  aguardando_confirmacao_manual: '⏳ Aguardando Confirmação',  // <--- NOVO
  pago: '✅ Pago',
  preparando: 'Preparando',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

export function MeusPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    carregarPedidos()
  }, [])

  const carregarPedidos = async () => {
    setIsLoading(true)
    try {
      const data = await pedidosApi.meusPedidos()
      setPedidos(data)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      showToast.error('Erro ao carregar pedidos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleIrParaPagamento = (pedido: Pedido) => {
    navigate('/pagamento', {
      state: { pedidoPublicId: pedido.public_id }
    })
  }

  if (isLoading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 mt-1" />
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display text-brown-800 mb-8">📋 Meus Pedidos</h1>

      {pedidos.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-brown-600">Você ainda não tem pedidos</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <Card key={pedido.id} variant="hover" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display text-brown-800">Pedido #{pedido.id}</h3>
                <p className="text-sm text-brown-600">
                  {new Date(pedido.created_at).toLocaleDateString('pt-AO')} às{' '}
                  {new Date(pedido.created_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-brown-600">
                  {pedido.itens?.length || 0} itens • Mesa {pedido.mesa_numero}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gold-600">
                  {pedido.total.toLocaleString('pt-AO')} Kz
                </span>
                <Badge variant={statusColors[pedido.status] || 'default'}>
                  {statusLabels[pedido.status] || pedido.status}
                </Badge>
                {/* 🔥 Botão de Pagamento para pedidos aguardando pagamento */}
                {pedido.status === 'aguardando_pagamento' && (
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleIrParaPagamento(pedido)}
                  >
                    💳 Pagar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  )
}
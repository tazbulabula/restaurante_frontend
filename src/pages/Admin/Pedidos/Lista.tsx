// src/pages/Admin/Pedidos/Lista.tsx

import { useState, useEffect } from 'react'
import { Container, Card, Button, Badge, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { pedidosApi } from '@/api/pedidos'
import type { Pedido } from '@/types/pedido.types'

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  aguardando_pagamento: 'warning',
  aguardando_confirmacao_manual: 'warning',
  pago: 'success',
  preparando: 'info',
  pronto: 'success',
  entregue: 'success',
  cancelado: 'danger',
}

const statusLabels: Record<string, string> = {
  aguardando_pagamento: 'Aguardando Pagamento',
  aguardando_confirmacao_manual: '⏳ Aguardando Confirmação',
  pago: '✅ Pago',
  preparando: 'Preparando',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

const STATUS_ADMIN = ['aguardando_confirmacao_manual', 'preparando', 'pronto', 'entregue', 'cancelado']
const STATUS_SISTEMA = ['aguardando_pagamento', 'pago']

const METODOS_PAGAMENTO = [
  { value: 'emis', label: '💳 Multicaixa Express', icon: '📱' },
  { value: 'dinheiro', label: '💰 Dinheiro', icon: '💵' },
  { value: 'transferencia', label: '🏦 Transferência Bancária', icon: '💸' },
  { value: 'pos', label: '💳 POS (Cartão)', icon: '💳' },
]

export function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])  // <--- ADICIONADO
  const [isLoading, setIsLoading] = useState(true)
  const [pagamentoModal, setPagamentoModal] = useState<{
    isOpen: boolean
    pedido: Pedido | null
    metodo: string
  }>({
    isOpen: false,
    pedido: null,
    metodo: '',
  })
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    publicId: string
    novoStatus: string
  }>({
    isOpen: false,
    publicId: '',
    novoStatus: '',
  })

  useEffect(() => {
    carregarPedidos()
  }, [])

  const carregarPedidos = async () => {
    setIsLoading(true)
    try {
      const data = await pedidosApi.listar()
      setPedidos(data)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      showToast.error('Erro ao carregar pedidos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (publicId: string, novoStatus: string) => {
    // Bloqueia alteração para status do sistema
    if (novoStatus === 'pago') {
      showToast.error('O status "Pago" é confirmado automaticamente pelo sistema')
      return
    }
    setStatusModal({ isOpen: true, publicId, novoStatus })
  }

  const handleStatusConfirm = async () => {
    const { publicId, novoStatus } = statusModal
    try {
      await pedidosApi.atualizarStatus(publicId, novoStatus)
      showToast.success('Status do pedido atualizado com sucesso')
      setStatusModal({ isOpen: false, publicId: '', novoStatus: '' })
      await carregarPedidos()
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao atualizar status')
    }
  }

  const handlePagamentoManual = (pedido: Pedido) => {
    setPagamentoModal({ isOpen: true, pedido, metodo: '' })
  }

  const confirmarPagamentoManual = async () => {
    const { pedido, metodo } = pagamentoModal
    if (!pedido || !metodo) return

    try {
      await pedidosApi.pagamentoManual(pedido.public_id, metodo)
      
      const metodoLabel = METODOS_PAGAMENTO.find(m => m.value === metodo)?.label || metodo
      showToast.success(`Pagamento via ${metodoLabel} registrado com sucesso!`)
      
      setPagamentoModal({ isOpen: false, pedido: null, metodo: '' })
      await carregarPedidos()
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao registrar pagamento')
    }
  }

  if (isLoading) {
    return (
      <Container className="py-8 flex justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-display text-brown-800 mb-6">📦 Gerenciar Pedidos</h1>

      {pedidos.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-brown-600">Nenhum pedido encontrado</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <Card key={pedido.id} variant="bordered" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display text-brown-800">Pedido #{pedido.id}</h3>
                <p className="text-sm text-brown-600">
                  {new Date(pedido.created_at).toLocaleDateString('pt-AO')} às{' '}
                  {new Date(pedido.created_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-brown-600">
                  {pedido.cliente_nome} • {pedido.cliente_telefone}
                </p>
                <p className="text-sm text-brown-600">
                  {pedido.itens?.length || 0} itens • Mesa {pedido.mesa_numero}
                </p>
                {pedido.observacoes && (
                  <p className="text-sm text-brown-500 italic mt-1">"{pedido.observacoes}"</p>
                )}
                {pedido.status === 'pago' && pedido.codigo_autorizacao && (
                  <p className="text-xs text-green-600 mt-1">
                    Autorização: {pedido.codigo_autorizacao}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-gold-600">
                  {pedido.total.toLocaleString('pt-AO')} Kz
                </span>
                <Badge variant={statusColors[pedido.status] || 'default'}>
                  {statusLabels[pedido.status] || pedido.status}
                </Badge>
                <select
                  value={pedido.status}
                  onChange={(e) => handleStatusChange(pedido.public_id, e.target.value)}
                  className="text-sm rounded-lg border border-brown-200 px-2 py-1"
                  disabled={pedido.status === 'pago'}
                >
                  {/* Opções que o admin pode alterar */}
                  {STATUS_ADMIN.map(opt => (
                    <option key={opt} value={opt}>
                      {statusLabels[opt] || opt}
                    </option>
                  ))}
                  {/* Mostra o status atual se for do sistema */}
                  {STATUS_SISTEMA.includes(pedido.status) && (
                    <option value={pedido.status} disabled>
                      {statusLabels[pedido.status] || pedido.status} (Sistema)
                    </option>
                  )}
                </select>
                {/* Botão de pagamento manual apenas para pedidos aguardando */}
                {pedido.status === 'aguardando_pagamento' && (
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handlePagamentoManual(pedido)}
                  >
                    💳 Pagar Manual
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Pagamento Manual */}
      <ConfirmModal
        isOpen={pagamentoModal.isOpen}
        onClose={() => setPagamentoModal({ isOpen: false, pedido: null, metodo: '' })}
        onConfirm={confirmarPagamentoManual}
        title="Registrar Pagamento Manual"
        message={
          <div className="space-y-4">
            <p className="text-brown-600">
              Pedido #{pagamentoModal.pedido?.id} - {pagamentoModal.pedido?.total.toLocaleString('pt-AO')} Kz
            </p>
            <div>
              <p className="text-sm font-medium text-brown-700 mb-2">Método de Pagamento:</p>
              <div className="grid grid-cols-2 gap-2">
                {METODOS_PAGAMENTO.map(metodo => (
                  <button
                    key={metodo.value}
                    onClick={() => setPagamentoModal(prev => ({ ...prev, metodo: metodo.value }))}
                    className={`p-3 rounded-lg border-2 text-sm transition ${
                      pagamentoModal.metodo === metodo.value
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-gray-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="text-xl">{metodo.icon}</div>
                    <span className="text-xs">{metodo.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
        confirmText="Confirmar Pagamento"
        cancelText="Cancelar"
        variant="warning"
        disabled={!pagamentoModal.metodo}
      />

      {/* Modal de Alteração de Status */}
      <ConfirmModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, publicId: '', novoStatus: '' })}
        onConfirm={handleStatusConfirm}
        title="Confirmar Alteração"
        message={`Deseja realmente alterar o status deste pedido?`}
        confirmText="Sim, Alterar"
        cancelText="Cancelar"
        variant="warning"
      />
    </Container>
  )
}
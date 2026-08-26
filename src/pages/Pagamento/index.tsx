// src/pages/Pagamento/index.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, Spinner, Divider, showToast } from '@/components/ui'
import { pagamentoApi } from '@/api/pagamento'
import { pedidosApi } from '@/api/pedidos'
import { useAuthStore } from '@/store/authStore'
import type { Pedido } from '@/types/pedido.types'

const METODOS_PAGAMENTO = [
  { value: 'emis', label: 'Multicaixa Express', icon: '📱', description: 'Pague pelo app' },
  { value: 'dinheiro', label: 'Dinheiro', icon: '💵', description: 'Pague em espécie no restaurante' },
  { value: 'transferencia', label: 'Transferência', icon: '💸', description: 'Transferência bancária' },
  { value: 'pos', label: 'POS (Cartão)', icon: '💳', description: 'Cartão de débito/crédito' },
]

export function Pagamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [metodoSelecionado, setMetodoSelecionado] = useState<string | null>(null)
  const [telefone, setTelefone] = useState(user?.phone || '')
  const [isProcessing, setIsProcessing] = useState(false)

  // Pega o public_id do pedido da URL ou do state
  const pedidoPublicId = location.state?.pedidoPublicId || 
    new URLSearchParams(location.search).get('pedido')

  useEffect(() => {
    if (!pedidoPublicId) {
      showToast.error('Nenhum pedido encontrado')
      navigate('/cardapio')
      return
    }
    carregarPedido()
  }, [pedidoPublicId])

  const carregarPedido = async () => {
    setIsLoading(true)
    try {
      const data = await pedidosApi.buscarPorPublicId(pedidoPublicId)
      setPedido(data)
    } catch (error) {
      console.error('Erro ao carregar pedido:', error)
      showToast.error('Erro ao carregar pedido')
      navigate('/cardapio')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePagamento = async () => {
    if (!metodoSelecionado || !pedido) return

    setIsProcessing(true)

    try {
      if (metodoSelecionado === 'emis') {
        // ✅ Pagamento via EMIS (automático)
        await pagamentoApi.iniciar({
          pedido_public_id: pedido.public_id,
          telefone,
        })
        showToast.success('Pagamento iniciado! Aguarde confirmação no Multicaixa Express.')
        // Redireciona para meus pedidos
        setTimeout(() => navigate('/pedidos/meus'), 3000)
        
      } else {
        // ✅ Pagamento manual (dinheiro, transferência, POS)
        // 1. Atualiza o pedido com o método escolhido
        await pedidosApi.selecionarMetodoPagamento(pedido.public_id, metodoSelecionado)
        
        const metodoLabel = METODOS_PAGAMENTO.find(m => m.value === metodoSelecionado)?.label
        
        showToast.success(
          `✅ Pedido registrado! Pague em ${metodoLabel} no restaurante.`
        )
        
        // 2. Redireciona para meus pedidos
        navigate('/pedidos/meus', { 
          state: { message: `Pagamento em ${metodoLabel} aguardando confirmação.` }
        })
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao processar pagamento')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <Container className="py-12 flex justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  if (!pedido) {
    return (
      <Container className="py-12">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-display text-brown-800">Pedido não encontrado</h2>
          <Link to="/cardapio">
            <Button variant="gold" className="mt-4">Voltar ao Cardápio</Button>
          </Link>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display text-brown-800 mb-8">💳 Pagamento</h1>

      <Card variant="gold" className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-brown-800">Escolha o método de pagamento</CardTitle>
          <p className="text-sm text-brown-500">
            Pedido #{pedido.id} - Total: {pedido.total.toLocaleString('pt-AO')} Kz
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métodos de Pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {METODOS_PAGAMENTO.map(metodo => (
              <div
                key={metodo.value}
                onClick={() => setMetodoSelecionado(metodo.value)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  metodoSelecionado === metodo.value
                    ? 'border-gold-500 bg-gold-50'
                    : 'border-gray-200 hover:border-gold-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{metodo.icon}</span>
                  <div>
                    <h3 className="font-medium text-brown-800">{metodo.label}</h3>
                    <p className="text-sm text-brown-500">{metodo.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Campo de telefone (apenas para EMIS) */}
          {metodoSelecionado === 'emis' && (
            <Input
              label="Telefone Multicaixa Express"
              type="tel"
              placeholder="+244 999 999 999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          )}

          {/* Resumo do pedido */}
          <div className="bg-cream-50 p-4 rounded-lg">
            <div className="flex justify-between text-brown-700">
              <span>Total a pagar</span>
              <span className="font-bold text-gold-600">
                {pedido.total.toLocaleString('pt-AO')} Kz
              </span>
            </div>
          </div>

          {/* Instruções para pagamento manual */}
          {metodoSelecionado && metodoSelecionado !== 'emis' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                ℹ️ Você será redirecionado para finalizar o pedido. 
                Pague no restaurante utilizando o método selecionado.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="gold"
            fullWidth
            onClick={handlePagamento}
            isLoading={isProcessing}
            disabled={!metodoSelecionado || (metodoSelecionado === 'emis' && !telefone)}
          >
            {metodoSelecionado === 'emis'
              ? 'Pagar com Multicaixa Express'
              : `Confirmar Pagamento em ${METODOS_PAGAMENTO.find(m => m.value === metodoSelecionado)?.label}`}
          </Button>
        </CardFooter>
      </Card>
    </Container>
  )
}

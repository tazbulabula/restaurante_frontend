// src/pages/Pedidos/Checkout.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, Divider, showToast } from '@/components/ui'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { pedidosApi } from '@/api/pedidos'

export function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    nome: user?.username || '',
    telefone: user?.phone || '',
    observacoes: '',
  })

  const taxaServico = total * 0.1
  const totalFinal = total + taxaServico

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        const pedidoData = {
        mesa_numero: 1,
        cliente_nome: form.nome,
        cliente_telefone: form.telefone,
        observacoes: form.observacoes,
        itens: items.map(item => ({
            produto_id: item.produto_id,
            quantidade: item.quantidade,
        })),
        }

        const pedido = await pedidosApi.criar(pedidoData)

        // Limpa o carrinho
        clearCart()

        showToast.success('Pedido criado com sucesso!')

        // 🔥 Redireciona para a página de pagamento
        navigate('/pagamento', {
        state: { pedidoPublicId: pedido.public_id }
        })

    } catch (error: any) {
        console.error('Erro ao criar pedido:', error)
        showToast.error(error.response?.data?.detail || 'Erro ao criar pedido')
    } finally {
        setIsLoading(false)
    }
    }


  if (items.length === 0) {
    return (
      <Container className="py-12">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-display text-brown-800 mb-4">Carrinho Vazio</h2>
          <p className="text-brown-600 mb-6">Adicione itens ao carrinho antes de finalizar.</p>
          <Link to="/cardapio">
            <Button variant="gold">Ver Cardápio</Button>
          </Link>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display text-brown-800 mb-8">💳 Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="md:col-span-2">
          <Card variant="gold">
            <CardHeader>
              <CardTitle className="text-brown-800">Dados do Pedido</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <Input
                  label="Nome Completo"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                />
                <Input
                  label="Telefone"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="+244 999 999 999"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-brown-700">Observações</label>
                  <textarea
                    name="observacoes"
                    value={form.observacoes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-brown-200 px-4 py-2 mt-1 focus:ring-2 focus:ring-gold-500"
                    placeholder="Alguma observação sobre o pedido?"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" variant="gold" fullWidth isLoading={isLoading}>
                  Confirmar Pedido
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Resumo */}
        <div className="md:col-span-1">
          <Card variant="gold" className="sticky top-24">
            <h3 className="text-xl font-display text-brown-800 mb-4">📋 Resumo</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.produto_id} className="flex justify-between text-sm text-brown-600">
                  <span>{item.quantidade}x {item.name}</span>
                  <span>{(item.price * item.quantidade).toLocaleString('pt-AO')} Kz</span>
                </div>
              ))}
              <Divider />
              <div className="flex justify-between text-brown-600">
                <span>Subtotal</span>
                <span>{total.toLocaleString('pt-AO')} Kz</span>
              </div>
              <div className="flex justify-between text-brown-600">
                <span>Taxa de serviço (10%)</span>
                <span>{taxaServico.toLocaleString('pt-AO')} Kz</span>
              </div>
              <Divider />
              <div className="flex justify-between text-lg font-bold text-brown-800">
                <span>Total</span>
                <span className="text-gold-600">
                  {totalFinal.toLocaleString('pt-AO')} Kz
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}
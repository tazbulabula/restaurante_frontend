// src/pages/Pedidos/Carrinho.tsx

import { Link } from 'react-router-dom'
import { Container, Card, Button, showToast } from '@/components/ui'
import { useCartStore } from '@/store/cartStore'

export function Carrinho() {
  const { items, total, removeItem, updateQuantidade, clearCart } = useCartStore()

  const handleRemoveItem = (produtoId: number, name: string) => {
    removeItem(produtoId)
    showToast.success(`${name} removido do carrinho`)
  }

  const handleUpdateQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade < 1) {
      handleRemoveItem(produtoId, '')
      return
    }
    updateQuantidade(produtoId, quantidade)
  }

  const taxaServico = total * 0.1
  const totalFinal = total + taxaServico

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-display text-brown-800 mb-4">🛒 Carrinho Vazio</h2>
          <p className="text-brown-600 mb-6">Seu carrinho está vazio. Que tal dar uma olhada no cardápio?</p>
          <Link to="/cardapio">
            <Button variant="gold">Ver Cardápio</Button>
          </Link>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display text-brown-800 mb-8">🛒 Carrinho</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Lista de Itens */}
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <Card key={item.produto_id} variant="bordered" className="flex justify-between items-center">
              <div>
                <h3 className="font-display text-brown-800">{item.name}</h3>
                <p className="text-sm text-brown-600">
                  {item.price.toLocaleString('pt-AO')} Kz
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline-gold"
                    size="sm"
                    onClick={() => handleUpdateQuantidade(item.produto_id, item.quantidade - 1)}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantidade}</span>
                  <Button
                    variant="outline-gold"
                    size="sm"
                    onClick={() => handleUpdateQuantidade(item.produto_id, item.quantidade + 1)}
                  >
                    +
                  </Button>
                </div>
                <span className="font-bold text-gold-600 min-w-[100px] text-right">
                  {(item.price * item.quantidade).toLocaleString('pt-AO')} Kz
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveItem(item.produto_id, item.name)}
                >
                  ✕
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Resumo */}
        <Card variant="gold" className="h-fit sticky top-24">
          <h3 className="text-xl font-display text-brown-800 mb-4">Resumo</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-brown-600">
              <span>Subtotal ({items.length} itens)</span>
              <span>{total.toLocaleString('pt-AO')} Kz</span>
            </div>
            <div className="flex justify-between text-brown-600">
              <span>Taxa de serviço (10%)</span>
              <span>{taxaServico.toLocaleString('pt-AO')} Kz</span>
            </div>
            <div className="border-t border-cream-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-brown-800">
                <span>Total</span>
                <span className="text-gold-600">
                  {totalFinal.toLocaleString('pt-AO')} Kz
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Link to="/checkout">
              <Button variant="gold" fullWidth>
                Finalizar Pedido
              </Button>
            </Link>
            <Button
              variant="outline-gold"
              fullWidth
              onClick={() => {
                clearCart()
                showToast.info('Carrinho esvaziado')
              }}
            >
              Limpar Carrinho
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  )
}
// src/pages/Produto/Detalhe.tsx

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Container, Card, Button, Badge, Spinner, showToast } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import { useCartStore } from '@/store/cartStore'
import type { Produto } from '@/types/produto.types'

export function DetalheProduto() {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const [produto, setProduto] = useState<Produto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (publicId) {
      carregarProduto(publicId)
    }
  }, [publicId])

  const carregarProduto = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await produtosApi.buscarPorPublicId(id)
      setProduto(data)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      showToast.error('Produto não encontrado')
      navigate('/cardapio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!produto) return
    addItem(
      { id: produto.id, name: produto.name, price: produto.price },
      quantidade
    )
    showToast.success(`${produto.name} adicionado ao carrinho!`)
  }

  if (isLoading) {
    return (
      <Container className="py-12 flex justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  if (!produto) {
    return (
      <Container className="py-12">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-display text-brown-800">Produto não encontrado</h2>
          <Link to="/cardapio">
            <Button variant="gold" className="mt-4">Voltar ao Cardápio</Button>
          </Link>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Imagem (placeholder) */}
        <div className="bg-cream-100 rounded-xl h-96 flex items-center justify-center">
          <span className="text-8xl">🍽️</span>
        </div>

        {/* Informações */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="info">{produto.category}</Badge>
            {produto.is_available ? (
              <Badge variant="success">Disponível</Badge>
            ) : (
              <Badge variant="danger">Indisponível</Badge>
            )}
          </div>

          <h1 className="text-4xl font-display text-brown-800 mb-4">
            {produto.name}
          </h1>

          {produto.description && (
            <p className="text-brown-600 text-lg mb-6">
              {produto.description}
            </p>
          )}

          {produto.subcategory && (
            <p className="text-sm text-brown-500 mb-4">
              Subcategoria: {produto.subcategory}
            </p>
          )}

          <div className="text-3xl font-bold text-gold-600 mb-6">
            {produto.price.toLocaleString('pt-AO')} Kz
          </div>

          {/* Quantidade */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-brown-700 font-medium">Quantidade:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline-gold"
                size="sm"
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                disabled={!produto.is_available}
              >
                -
              </Button>
              <span className="w-12 text-center text-lg font-medium">{quantidade}</span>
              <Button
                variant="outline-gold"
                size="sm"
                onClick={() => setQuantidade(quantidade + 1)}
                disabled={!produto.is_available}
              >
                +
              </Button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={handleAddToCart}
              disabled={!produto.is_available}
              fullWidth
            >
              {produto.is_available ? 'Adicionar ao Carrinho' : 'Indisponível'}
            </Button>
            <Link to="/cardapio" className="w-full sm:w-auto">
              <Button variant="outline-gold" size="lg" fullWidth>
                Voltar
              </Button>
            </Link>
            
          </div>
        </div>
      </div>
    </Container>
  )
}
// src/pages/Cardapio/index.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Button, Badge, Input, Spinner } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/components/ui'
import { CardapioSkeleton } from '@/components/Skeletons/CardapioSkeleton'
import type { Produto } from '@/types/produto.types'

export function Cardapio() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    setIsLoading(true)
    try {
      const data = await produtosApi.listar({ disponivel: true })
      setProdutos(data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      showToast.error('Erro ao carregar cardápio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (produto: Produto) => {
    // ✅ Adiciona ao carrinho
    addItem({ id: produto.id, name: produto.name, price: produto.price })
    
    // ✅ Mensagem diferente para logado/não logado
    if (!isAuthenticated) {
      showToast.warning(`🔒 "${produto.name}" adicionado! Faça login para finalizar a compra.`, 5000)
    } else {
      showToast.success(`${produto.name} adicionado ao carrinho!`)
    }
  }

  const filtered = produtos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || p.category === category)
  )

  const categorias = [...new Set(produtos.map(p => p.category))]

  if (isLoading) {
    return (
      <Container className="py-12 flex justify-center">
        <CardapioSkeleton />
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display text-brown-800 mb-8">Cardápio</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Input
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={category === '' ? 'gold' : 'outline-gold'}
            size="sm"
            onClick={() => setCategory('')}
          >
            Todos
          </Button>
          {categorias.map(cat => (
            <Button
              key={cat}
              variant={category === cat ? 'gold' : 'outline-gold'}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(produto => (
          <Card key={produto.id} variant="hover" className="flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-display text-brown-800">
                  {produto.name}
                </h3>
                <Badge variant="info" size="sm">
                  {produto.category}
                </Badge>
              </div>
              {produto.description && (
                <p className="text-brown-600 text-sm mt-1">{produto.description}</p>
              )}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-cream-200">
              <Link to={`/produto/${produto.public_id}`} className="flex-1">
                <Button variant="outline-gold" size="sm" fullWidth>
                  Detalhes
                </Button>
              </Link>
              <Button
                variant="gold"
                size="sm"
                className="flex-1"
                onClick={() => handleAddToCart(produto)}
              >
                Adicionar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-brown-500">
          Nenhum produto encontrado
        </div>
      )}
    </Container>
  )
}
// src/pages/Admin/Produtos/Criar.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, CardFooter, Button, Input, showToast } from '@/components/ui'
import { produtosApi } from '@/api/produtos'

interface ProdutoForm {
  name: string
  description: string
  price: string
  category: string
  subcategory: string
  is_available: boolean
}

export function AdminProdutosCriar() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<ProdutoForm>({
    name: '',
    description: '',
    price: '',
    category: 'principal',
    subcategory: '',
    is_available: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const produtoData = {
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        category: form.category,
        subcategory: form.subcategory || undefined,
        is_available: form.is_available,
      }

      await produtosApi.criar(produtoData)
      showToast.success('Produto criado com sucesso!')
      navigate('/admin/produtos')
    } catch (error: any) {
      console.error('Erro ao criar produto:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar produto')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }))
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-display text-brown-800 mb-6">➕ Novo Produto</h1>

      <Card variant="gold" className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Nome do Produto"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-brown-700">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-brown-200 px-4 py-2 mt-1 focus:ring-2 focus:ring-gold-500"
                placeholder="Descrição do produto"
              />
            </div>
            <Input
              label="Preço (Kz)"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              step="0.01"
            />
            <div>
              <label className="block text-sm font-medium text-brown-700">Categoria</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-brown-200 px-4 py-2 mt-1 focus:ring-2 focus:ring-gold-500"
              >
                <option value="principal">Principal</option>
                <option value="entrada">Entrada</option>
                <option value="sobremesa">Sobremesa</option>
                <option value="bebida">Bebida</option>
                <option value="refrigerante">Refrigerante</option>
                <option value="sucos">Sucos</option>
                <option value="cerveja">Cerveja</option>
                <option value="cafe">Café</option>
                <option value="petisco">Petisco</option>
                <option value="porcoes">Porções</option>
                <option value="doces">Doces</option>
                <option value="salgados">Salgados</option>
              </select>
            </div>
            <Input
              label="Subcategoria"
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              placeholder="Ex: Carnes, Massas, ..."
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={handleChange}
                className="w-4 h-4 text-gold-500 rounded"
              />
              <label className="text-sm text-brown-700">Disponível</label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isLoading}>
              Salvar Produto
            </Button>
            <Button
              variant="outline-gold"
              type="button"
              fullWidth
              onClick={() => navigate('/admin/produtos')}
            >
              Cancelar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Container>
  )
}
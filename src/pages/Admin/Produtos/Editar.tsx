// src/pages/Admin/Produtos/Editar.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, Spinner, showToast } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import type { Produto } from '@/types/produto.types'

export function AdminProdutosEditar() {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<Partial<Produto>>({
    name: '',
    description: '',
    price: 0,
    category: 'principal',
    subcategory: '',
    is_available: true,
  })

  useEffect(() => {
    if (publicId) {
      carregarProduto(publicId)
    }
  }, [publicId])

  const carregarProduto = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await produtosApi.buscarPorPublicId(id)
      setForm(data)
    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      showToast.error('Erro ao carregar produto')
      navigate('/admin/produtos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicId) return

    setIsSaving(true)
    try {
      await produtosApi.atualizar(publicId, form)
      showToast.success('Produto atualizado com sucesso!')
      navigate('/admin/produtos')
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      showToast.error('Erro ao atualizar produto')
    } finally {
      setIsSaving(false)
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
      <h1 className="text-3xl font-display text-brown-800 mb-6">✏️ Editar Produto</h1>

      <Card variant="gold" className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Nome do Produto"
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-brown-700">Descrição</label>
              <textarea
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-brown-200 px-4 py-2 mt-1 focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <Input
              label="Preço (Kz)"
              type="number"
              name="price"
              value={form.price || ''}
              onChange={handleChange}
              required
              step="0.01"
            />
            <div>
              <label className="block text-sm font-medium text-brown-700">Categoria</label>
              <select
                name="category"
                value={form.category || 'principal'}
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
              value={form.subcategory || ''}
              onChange={handleChange}
              placeholder="Ex: Carnes, Massas, ..."
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available !== undefined ? form.is_available : true}
                onChange={handleChange}
                className="w-4 h-4 text-gold-500 rounded"
              />
              <label className="text-sm text-brown-700">Disponível</label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isSaving}>
              Atualizar Produto
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
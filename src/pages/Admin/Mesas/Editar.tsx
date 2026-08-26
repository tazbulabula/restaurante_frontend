// src/pages/Admin/Mesas/Editar.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Card, CardContent, CardFooter, Button, Input, Spinner, showToast } from '@/components/ui'
import { mesasApi } from '@/api/mesas'
import type { Mesa } from '@/types/mesa.types'

export function AdminMesasEditar() {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<Partial<Mesa>>({
    numero: 0,
    capacidade: 0,
    tipo: 'padrao',
    localizacao: '',
    is_active: true,
  })

  useEffect(() => {
    if (publicId) {
      carregarMesa(publicId)
    }
  }, [publicId])

  const carregarMesa = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await mesasApi.buscarPorPublicId(id)
      setForm(data)
    } catch (error) {
      console.error('Erro ao carregar mesa:', error)
      showToast.error('Erro ao carregar mesa')
      navigate('/admin/mesas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicId) return

    setIsSaving(true)
    try {
      await mesasApi.atualizar(publicId, form)
      showToast.success('Mesa atualizada com sucesso!')
      navigate('/admin/mesas')
    } catch (error: any) {
      console.error('Erro ao atualizar mesa:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao atualizar mesa')
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
      <h1 className="text-3xl font-display text-brown-800 mb-6">✏️ Editar Mesa</h1>

      <Card variant="gold" className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Número da Mesa"
              type="number"
              name="numero"
              value={form.numero || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Capacidade"
              type="number"
              name="capacidade"
              value={form.capacidade || ''}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-brown-700">Tipo</label>
              <select
                name="tipo"
                value={form.tipo || 'padrao'}
                onChange={handleChange}
                className="w-full rounded-lg border border-brown-200 px-4 py-2 mt-1 focus:ring-2 focus:ring-gold-500"
              >
                <option value="padrao">Padrão</option>
                <option value="vip">VIP</option>
                <option value="jantar">Jantar</option>
                <option value="externa">Externa</option>
                <option value="bar">Bar</option>
              </select>
            </div>
            <Input
              label="Localização"
              name="localizacao"
              value={form.localizacao || ''}
              onChange={handleChange}
              placeholder="Ex: Salão Principal, Terraço, ..."
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active !== undefined ? form.is_active : true}
                onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-gold-500 rounded"
              />
              <label className="text-sm text-brown-700">Ativa</label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isSaving}>
              Atualizar Mesa
            </Button>
            <Button
              variant="outline-gold"
              type="button"
              fullWidth
              onClick={() => navigate('/admin/mesas')}
            >
              Cancelar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Container>
  )
}
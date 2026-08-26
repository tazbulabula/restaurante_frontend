// src/pages/Admin/Clientes/Editar.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Card, CardContent, CardFooter, Button, Input, Spinner, showToast } from '@/components/ui'
import { usersApi } from '@/api/users'
import type { User } from '@/types/auth.types'

export function AdminClientesEditar() {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<Partial<User>>({
    username: '',
    email: '',
    phone: '',
    user_type: 'cliente',
  })

  useEffect(() => {
    if (publicId) {
      carregarCliente(publicId)
    }
  }, [publicId])

  const carregarCliente = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await usersApi.buscarPorPublicId(id)
      setForm(data)
    } catch (error) {
      console.error('Erro ao carregar cliente:', error)
      showToast.error('Erro ao carregar cliente')
      navigate('/admin/clientes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicId) return

    setIsSaving(true)
    try {
      await usersApi.atualizar(publicId, form)
      showToast.success('Cliente atualizado com sucesso!')
      navigate('/admin/clientes')
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao atualizar cliente')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
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
      <h1 className="text-3xl font-display text-brown-800 mb-6">✏️ Editar Cliente</h1>

      <Card variant="gold" className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Nome"
              name="username"
              value={form.username || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Telefone"
              name="phone"
              value={form.phone || ''}
              onChange={handleChange}
              placeholder="+244 999 999 999"
            />
            <div>
              <label className="block text-sm font-medium text-brown-700">Tipo</label>
              <select
                name="user_type"
                value={form.user_type || 'cliente'}
                onChange={handleChange}
                className="w-full rounded-lg border border-brown-200 px-4 py-2 mt-1 focus:ring-2 focus:ring-gold-500"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isSaving}>
              Atualizar Cliente
            </Button>
            <Button
              variant="outline-gold"
              type="button"
              fullWidth
              onClick={() => navigate('/admin/clientes')}
            >
              Cancelar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Container>
  )
}
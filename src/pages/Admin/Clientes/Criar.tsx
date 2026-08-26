// src/pages/Admin/Clientes/Criar.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, CardFooter, Button, Input, showToast } from '@/components/ui'
import { usersApi } from '@/api/users'

export function AdminClientesCriar() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    user_type: 'cliente',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await usersApi.criar(form)
      showToast.success('Cliente criado com sucesso!')
      navigate('/admin/clientes')
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar cliente')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-display text-brown-800 mb-6">➕ Novo Cliente</h1>

      <Card variant="gold" className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Nome"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Senha"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Telefone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+244 999 999 999"
            />
            <div>
              <label className="block text-sm font-medium text-brown-700">Tipo</label>
              <select
                name="user_type"
                value={form.user_type}
                onChange={handleChange}
                className="w-full rounded-lg border border-brown-200 px-4 py-2 mt-1 focus:ring-2 focus:ring-gold-500"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isLoading}>
              Criar Cliente
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
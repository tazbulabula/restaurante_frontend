// src/pages/Admin/Mesas/Criar.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, CardFooter, Button, Input, showToast } from '@/components/ui'
import { mesasApi } from '@/api/mesas'

interface MesaForm {
  numero: string
  capacidade: string
  tipo: string
  localizacao: string
}

export function AdminMesasCriar() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<MesaForm>({
    numero: '',
    capacidade: '',
    tipo: 'padrao',
    localizacao: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const mesaData = {
        numero: Number(form.numero),
        capacidade: Number(form.capacidade),
        tipo: form.tipo,
        localizacao: form.localizacao || undefined,
      }

      await mesasApi.criar(mesaData)
      showToast.success('Mesa criada com sucesso!')
      navigate('/admin/mesas')
    } catch (error: any) {
      console.error('Erro ao criar mesa:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar mesa')
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
      <h1 className="text-3xl font-display text-brown-800 mb-6">➕ Nova Mesa</h1>

      <Card variant="gold" className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Número da Mesa"
              type="number"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              required
            />
            <Input
              label="Capacidade"
              type="number"
              name="capacidade"
              value={form.capacidade}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-brown-700">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
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
              value={form.localizacao}
              onChange={handleChange}
              placeholder="Ex: Salão Principal, Terraço, ..."
            />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isLoading}>
              Criar Mesa
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
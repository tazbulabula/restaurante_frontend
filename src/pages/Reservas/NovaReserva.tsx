// src/pages/Reservas/NovaReserva.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, showToast, Spinner } from '@/components/ui'
import { reservasApi } from '@/api/reservas'
import { mesasApi } from '@/api/mesas'
import { useAuthStore } from '@/store/authStore'
import type { Mesa } from '@/types/mesa.types'

export function NovaReserva() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMesas, setIsLoadingMesas] = useState(true)
  const [mesasDisponiveis, setMesasDisponiveis] = useState<Mesa[]>([])
  const [form, setForm] = useState({
    mesa_id: 0,
    data: '',
    hora: '',
    numero_pessoas: 2,
    cliente_nome: user?.username || '',
    cliente_telefone: user?.phone || '',
    observacoes: '',
  })

  useEffect(() => {
    carregarMesasDisponiveis()
  }, [])

  const carregarMesasDisponiveis = async () => {
    setIsLoadingMesas(true)
    try {
      const data = await mesasApi.listar({ disponivel: true })
      setMesasDisponiveis(data)
    } catch (error) {
      console.error('Erro ao carregar mesas:', error)
      showToast.error('Erro ao carregar mesas disponíveis')
    } finally {
      setIsLoadingMesas(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dataHora = `${form.data}T${form.hora}:00`

      const reservaData = {
        mesa_id: Number(form.mesa_id),
        data_hora: dataHora,
        numero_pessoas: form.numero_pessoas,
        cliente_nome: form.cliente_nome,
        cliente_telefone: form.cliente_telefone,
        observacoes: form.observacoes,
      }

      await reservasApi.criar(reservaData)
      showToast.success('Reserva criada com sucesso!')
      navigate('/reservas/minhas')
    } catch (error: any) {
      console.error('Erro ao criar reserva:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar reserva')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display text-brown-800 mb-8">📅 Nova Reserva</h1>

      <Card variant="gold" className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isLoadingMesas ? (
              <div className="flex justify-center py-4">
                <Spinner size="md" />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-brown-700">Mesa</label>
                <select
                  name="mesa_id"
                  value={form.mesa_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-brown-200 px-4 py-2 mt-1 focus:ring-2 focus:ring-gold-500"
                  required
                >
                  <option value="">Selecione uma mesa</option>
                  {mesasDisponiveis.map(mesa => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa {mesa.numero} - {mesa.capacidade} pessoas {mesa.localizacao ? `(${mesa.localizacao})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data"
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                required
              />
              <Input
                label="Horário"
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Número de Pessoas"
              type="number"
              name="numero_pessoas"
              min={1}
              max={20}
              value={form.numero_pessoas}
              onChange={handleChange}
              required
            />

            <Input
              label="Nome"
              name="cliente_nome"
              value={form.cliente_nome}
              onChange={handleChange}
              required
            />

            <Input
              label="Telefone"
              name="cliente_telefone"
              value={form.cliente_telefone}
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
                placeholder="Alguma observação para a reserva?"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="gold" fullWidth isLoading={isLoading}>
              Confirmar Reserva
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Container>
  )
}
// src/pages/Reservas/MinhasReservas.tsx

import { useState, useEffect } from 'react'
import { Container, Card, Badge, Button, Spinner, showToast } from '@/components/ui'
import { reservasApi } from '@/api/reservas'
import type { Reserva } from '@/types/reserva.types'

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  disponivel: 'success',
  reservada: 'warning',
  ocupada: 'danger',
  em_limpeza: 'info',
  indisponivel: 'default',
  cancelada: 'danger',     // <--- NOVO
  confirmada: 'success',
}

const statusLabels: Record<string, string> = {
  disponivel: 'Disponível',
  reservada: 'Reservada',
  ocupada: 'Ocupada',
  em_limpeza: 'Em Limpeza',
  indisponivel: 'Indisponível',
  cancelada: '❌ Cancelada',   // <--- NOVO
  confirmada: 'Confirmada',
}

export function MinhasReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelando, setCancelando] = useState<number | null>(null)

  useEffect(() => {
    carregarReservas()
  }, [])

  const carregarReservas = async () => {
    setIsLoading(true)
    try {
      const data = await reservasApi.minhasReservas()
      setReservas(data)
    } catch (error) {
      console.error('Erro ao carregar reservas:', error)
      showToast.error('Erro ao carregar reservas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelar = async (publicId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return

    setCancelando(1)
    try {
      await reservasApi.cancelar(publicId)
      showToast.success('Reserva cancelada com sucesso')
      await carregarReservas()
    } catch (error: any) {
      console.error('Erro ao cancelar reserva:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao cancelar reserva')
    } finally {
      setCancelando(null)
    }
  }

  if (isLoading) {
    return (
      <Container className="py-12 flex justify-center">
        <Spinner size="lg" />
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display text-brown-800 mb-8">📋 Minhas Reservas</h1>

      {reservas.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-brown-600">Você ainda não tem reservas</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservas.map(reserva => (
            <Card key={reserva.id} variant="hover" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display text-brown-800">
                  Mesa para {reserva.numero_pessoas} pessoas
                </h3>
                <p className="text-sm text-brown-600">
                  {new Date(reserva.data_hora).toLocaleDateString('pt-AO')} às{' '}
                  {new Date(reserva.data_hora).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {reserva.observacoes && (
                  <p className="text-sm text-brown-500 italic">"{reserva.observacoes}"</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={statusColors[reserva.status] || 'default'}>
                  {reserva.status}
                </Badge>
                {reserva.status === 'reservada' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancelar(reserva.public_id)}
                    isLoading={cancelando !== null}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  )
}
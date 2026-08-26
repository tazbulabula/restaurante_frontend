// src/pages/Admin/Reservas/Lista.tsx

import { useState, useEffect } from 'react'
import { Container, Card, Button, Badge, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { reservasApi } from '@/api/reservas'
import { mesasApi } from '@/api/mesas'
import type { Reserva } from '@/types/reserva.types'
import type { Mesa } from '@/types/mesa.types'

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  disponivel: 'success',
  reservada: 'warning',
  ocupada: 'danger',
  em_limpeza: 'info',
  indisponivel: 'default',
  confirmada: 'success',
}

export function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean
    publicId: string
    id: number
  }>({
    isOpen: false,
    publicId: '',
    id: 0,
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setIsLoading(true)
    try {
      const [reservasData, mesasData] = await Promise.all([
        reservasApi.listar(),
        mesasApi.listar(),
      ])
      setReservas(reservasData)
      setMesas(mesasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      showToast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const getMesaNumero = (mesaId: number) => {
    const mesa = mesas.find(m => m.id === mesaId)
    return mesa ? mesa.numero : 'N/A'
  }

  const handleCancelar = async (publicId: string, id: number) => {
    setCancelModal({ isOpen: true, publicId, id })
  }

  const handleCancelConfirm = async () => {
    const { publicId, id } = cancelModal
    try {
      await reservasApi.cancelar(publicId)
      showToast.success(`Reserva #${id} cancelada com sucesso`)
      setCancelModal({ isOpen: false, publicId: '', id: 0 })
      await carregarDados()
    } catch (error: any) {
      console.error('Erro ao cancelar reserva:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao cancelar reserva')
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
      <h1 className="text-3xl font-display text-brown-800 mb-6">📅 Gerenciar Reservas</h1>

      {reservas.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-brown-600">Nenhuma reserva encontrada</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservas.map(reserva => (
            <Card key={reserva.id} variant="bordered" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display text-brown-800">Reserva #{reserva.id}</h3>
                <p className="text-sm text-brown-600">
                  Mesa {getMesaNumero(reserva.mesa_id)} • {reserva.numero_pessoas} pessoas
                </p>
                <p className="text-sm text-brown-600">
                  {new Date(reserva.data_hora).toLocaleDateString('pt-AO')} às{' '}
                  {new Date(reserva.data_hora).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-brown-600">
                  {reserva.cliente_nome} • {reserva.cliente_telefone}
                </p>
                {reserva.observacoes && (
                  <p className="text-sm text-brown-500 italic mt-1">"{reserva.observacoes}"</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant={statusColors[reserva.status] || 'default'}>
                  {reserva.status}
                </Badge>
                {reserva.status === 'reservada' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancelar(reserva.public_id, reserva.id)}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <ConfirmModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, publicId: '', id: 0 })}
        onConfirm={handleCancelConfirm}
        title="Confirmar Cancelamento"
        message={`Tem certeza que deseja cancelar a Reserva #${cancelModal.id}?`}
        confirmText="Sim, Cancelar"
        cancelText="Voltar"
        variant="danger"
      />
    </Container>
  )
}
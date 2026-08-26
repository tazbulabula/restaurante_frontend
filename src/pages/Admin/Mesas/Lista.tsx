// src/pages/Admin/Mesas/Lista.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Button, Badge, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { mesasApi } from '@/api/mesas'
import type { Mesa } from '@/types/mesa.types'

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  disponivel: 'success',
  reservada: 'warning',
  ocupada: 'danger',
  em_limpeza: 'info',
  indisponivel: 'default',
}

export function AdminMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; publicId: string; numero: number }>({
    isOpen: false,
    publicId: '',
    numero: 0,
  })
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; publicId: string; novoStatus: string }>({
    isOpen: false,
    publicId: '',
    novoStatus: '',
  })

  useEffect(() => {
    carregarMesas()
  }, [])

  const carregarMesas = async () => {
    setIsLoading(true)
    try {
      const data = await mesasApi.listar()
      setMesas(data)
    } catch (error) {
      console.error('Erro ao carregar mesas:', error)
      showToast.error('Erro ao carregar mesas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    const { publicId, numero } = deleteModal
    try {
      await mesasApi.deletar(publicId)
      showToast.success(`Mesa ${numero} removida com sucesso`)
      setDeleteModal({ isOpen: false, publicId: '', numero: 0 })
      await carregarMesas()
    } catch (error: any) {
      console.error('Erro ao deletar mesa:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao deletar mesa')
    }
  }

  const handleStatusChange = async (publicId: string, novoStatus: string) => {
    setStatusModal({ isOpen: true, publicId, novoStatus })
  }

  const handleStatusConfirm = async () => {
    const { publicId, novoStatus } = statusModal
    try {
      await mesasApi.alterarStatus(publicId, novoStatus)
      showToast.success(`Status alterado com sucesso`)
      setStatusModal({ isOpen: false, publicId: '', novoStatus: '' })
      await carregarMesas()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      showToast.error('Erro ao alterar status')
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-display text-brown-800">🪑 Gerenciar Mesas</h1>
        <Link to="/admin/mesas/criar">
          <Button variant="gold">+ Nova Mesa</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mesas.map(mesa => (
          <Card key={mesa.id} variant="bordered" className="text-center">
            <div className="text-4xl mb-2">🪑</div>
            <h3 className="text-2xl font-display text-brown-800">Mesa {mesa.numero}</h3>
            <p className="text-sm text-brown-600">Capacidade: {mesa.capacidade} pessoas</p>
            <p className="text-sm text-brown-600">Tipo: {mesa.tipo}</p>
            {mesa.localizacao && (
              <p className="text-sm text-brown-500">{mesa.localizacao}</p>
            )}
            <div className="mt-3">
              <Badge variant={statusColors[mesa.status] || 'default'}>
                {mesa.status}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <select
                value={mesa.status}
                onChange={(e) => handleStatusChange(mesa.public_id, e.target.value)}
                className="text-sm rounded-lg border border-brown-200 px-2 py-1"
              >
                <option value="disponivel">Disponível</option>
                <option value="reservada">Reservada</option>
                <option value="ocupada">Ocupada</option>
                <option value="em_limpeza">Em Limpeza</option>
                <option value="indisponivel">Indisponível</option>
              </select>
              <Link to={`/admin/mesas/editar/${mesa.public_id}`}>
                <Button variant="outline-gold" size="sm">Editar</Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteModal({
                  isOpen: true,
                  publicId: mesa.public_id,
                  numero: mesa.numero,
                })}
              >
                Remover
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {mesas.length === 0 && (
        <div className="text-center py-12 text-brown-500">
          Nenhuma mesa cadastrada
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, publicId: '', numero: 0 })}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a Mesa ${deleteModal.numero}? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Status Change Modal */}
      <ConfirmModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, publicId: '', novoStatus: '' })}
        onConfirm={handleStatusConfirm}
        title="Confirmar Alteração"
        message={`Deseja realmente alterar o status da mesa?`}
        confirmText="Sim, Alterar"
        cancelText="Cancelar"
        variant="warning"
      />
    </Container>
  )
}
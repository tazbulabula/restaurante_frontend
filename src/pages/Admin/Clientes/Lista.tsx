// src/pages/Admin/Clientes/Lista.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Button, Badge, Input, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { usersApi } from '@/api/users'
import type { User } from '@/types/auth.types'

export function AdminClientes() {
  const [clientes, setClientes] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [total, setTotal] = useState(0)
  
  const [modal, setModal] = useState<{
    isOpen: boolean
    publicId: string
    username: string
    action: 'soft' | 'hard' | 'restore'
  }>({
    isOpen: false,
    publicId: '',
    username: '',
    action: 'soft',
  })

  useEffect(() => {
    carregarClientes()
  }, [includeDeleted])

  const carregarClientes = async () => {
    setIsLoading(true)
    try {
      const response = await usersApi.listar({
        search: search || undefined,
        include_deleted: includeDeleted,
      })
      
      setClientes(response.users || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      showToast.error('Erro ao carregar clientes')
      setClientes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    // Debounce para não fazer requisição a cada tecla
    clearTimeout((window as any).searchTimeout)
    ;(window as any).searchTimeout = setTimeout(() => {
      carregarClientes()
    }, 500)
  }

  const handleDelete = (publicId: string, username: string) => {
    setModal({ isOpen: true, publicId, username, action: 'soft' })
  }

  const handleHardDelete = (publicId: string, username: string) => {
    setModal({ isOpen: true, publicId, username, action: 'hard' })
  }

  const handleRestore = (publicId: string, username: string) => {
    setModal({ isOpen: true, publicId, username, action: 'restore' })
  }

  const handleModalConfirm = async () => {
    const { publicId, username, action } = modal
    try {
      if (action === 'soft') {
        await usersApi.deletar(publicId)
        showToast.success(`Usuário "${username}" desativado com sucesso`)
      } else if (action === 'hard') {
        await usersApi.deletarPermanentemente(publicId)
        showToast.success(`Usuário "${username}" removido permanentemente`)
      } else if (action === 'restore') {
        await usersApi.restaurar(publicId)
        showToast.success(`Usuário "${username}" restaurado com sucesso`)
      }
      
      setModal({ isOpen: false, publicId: '', username: '', action: 'soft' })
      await carregarClientes()
    } catch (error: any) {
      console.error('Erro ao processar ação:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao processar ação')
    }
  }

  const handleTipoChange = async (publicId: string, userType: string) => {
    try {
      await usersApi.alterarTipo(publicId, userType)
      showToast.success('Tipo alterado com sucesso')
      await carregarClientes()
    } catch (error: any) {
      console.error('Erro ao alterar tipo:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao alterar tipo')
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-display text-brown-800">
          👥 Gerenciar Clientes ({total})
        </h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/clientes/criar">
            <Button variant="gold">+ Novo Cliente</Button>
          </Link>
          <Button
            variant={includeDeleted ? 'gold' : 'outline-gold'}
            onClick={() => setIncludeDeleted(!includeDeleted)}
          >
            {includeDeleted ? '✅ Incluir Deletados' : '📋 Apenas Ativos'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Buscar cliente por nome ou email..."
          value={search}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      {/* Lista */}
      {clientes.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-brown-600">
            {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {clientes.map((cliente) => {
            const isDeleted = cliente.deleted_at !== null && cliente.deleted_at !== undefined
            
            return (
              <Card key={cliente.id} variant="bordered" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
                {/* Informações */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-brown-800">{cliente.username}</h3>
                    {isDeleted && <Badge variant="danger" size="sm">🗑️ Deletado</Badge>}
                  </div>
                  <p className="text-sm text-brown-600">{cliente.email}</p>
                  {cliente.phone && <p className="text-sm text-brown-500">{cliente.phone}</p>}
                  <div className="flex gap-2 mt-1">
                    <Badge variant={cliente.user_type === 'admin' ? 'warning' : 'info'}>
                      {cliente.user_type === 'admin' ? '👑 Admin' : '👤 Cliente'}
                    </Badge>
                    {isDeleted && cliente.deleted_at && (
                      <span className="text-xs text-brown-400">
                        Deletado em: {new Date(cliente.deleted_at).toLocaleDateString('pt-AO')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-wrap gap-2">
                  {isDeleted ? (
                    // Ações para usuários deletados
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleRestore(cliente.public_id, cliente.username)}
                      >
                        ↩️ Restaurar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleHardDelete(cliente.public_id, cliente.username)}
                      >
                        🗑️ Remover Permanentemente
                      </Button>
                    </>
                  ) : (
                    // Ações para usuários ativos
                    <>
                      <select
                        value={cliente.user_type}
                        onChange={(e) => handleTipoChange(cliente.public_id, e.target.value)}
                        className="text-sm rounded-lg border border-brown-200 px-2 py-1"
                      >
                        <option value="client">Cliente</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Link to={`/admin/clientes/editar/${cliente.public_id}`}>
                        <Button variant="outline-gold" size="sm">Editar</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(cliente.public_id, cliente.username)}
                      >
                        Desativar
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, publicId: '', username: '', action: 'soft' })}
        onConfirm={handleModalConfirm}
        title={
          modal.action === 'soft' ? 'Desativar Usuário' :
          modal.action === 'hard' ? 'Remover Permanentemente' :
          'Restaurar Usuário'
        }
        message={
          modal.action === 'soft'
            ? `Tem certeza que deseja desativar o usuário "${modal.username}"? Ele pode ser restaurado depois.`
            : modal.action === 'hard'
            ? `Tem certeza que deseja remover PERMANENTEMENTE o usuário "${modal.username}"? Esta ação não pode ser desfeita!`
            : `Tem certeza que deseja restaurar o usuário "${modal.username}"?`
        }
        confirmText={
          modal.action === 'soft' ? 'Sim, Desativar' :
          modal.action === 'hard' ? 'Sim, Remover Permanentemente' :
          'Sim, Restaurar'
        }
        cancelText="Cancelar"
        variant={
          modal.action === 'soft' ? 'warning' :
          modal.action === 'hard' ? 'danger' :
          'info'
        }
      />
    </Container>
  )
}
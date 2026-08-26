// src/pages/Admin/Produtos/Lista.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card, Button, Badge, Input, Spinner, showToast, ConfirmModal } from '@/components/ui'
import { produtosApi } from '@/api/produtos'
import type { Produto } from '@/types/produto.types'

export function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; publicId: string; name: string }>({
    isOpen: false,
    publicId: '',
    name: '',
  })

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    setIsLoading(true)
    try {
      const data = await produtosApi.listar()
      setProdutos(data)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      showToast.error('Erro ao carregar produtos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    const { publicId, name } = deleteModal
    try {
      await produtosApi.deletar(publicId)
      showToast.success(`"${name}" removido com sucesso`)
      setDeleteModal({ isOpen: false, publicId: '', name: '' })
      await carregarProdutos()
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      showToast.error('Erro ao deletar produto')
    }
  }

  const handleToggleDisponibilidade = async (produto: Produto) => {
    try {
      const updated = await produtosApi.alternarDisponibilidade(
        produto.public_id,
        !produto.is_available
      )
      setProdutos(prev =>
        prev.map(p => p.public_id === updated.public_id ? updated : p)
      )
      showToast.success(
        `${updated.name} ${updated.is_available ? 'disponível' : 'indisponível'}`
      )
    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error)
      showToast.error('Erro ao alterar disponibilidade')
    }
  }

  const filtered = produtos.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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
        <h1 className="text-3xl font-display text-brown-800">🍽️ Gerenciar Produtos</h1>
        <Link to="/admin/produtos/criar">
          <Button variant="gold">+ Novo Produto</Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(produto => (
          <Card key={produto.id} variant="bordered" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-display text-brown-800">{produto.name}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-brown-600">
                <span>{produto.price.toLocaleString('pt-AO')} Kz</span>
                <Badge variant={produto.is_available ? 'success' : 'danger'}>
                  {produto.is_available ? 'Disponível' : 'Indisponível'}
                </Badge>
                <Badge variant="info" size="sm">{produto.category}</Badge>
                {produto.subcategory && (
                  <span className="text-brown-400">{produto.subcategory}</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={produto.is_available ? 'outline-gold' : 'outline-gold'}
                size="sm"
                onClick={() => handleToggleDisponibilidade(produto)}
              >
                {produto.is_available ? '🟢 Desativar' : '🔴 Ativar'}
              </Button>
              <Link to={`/admin/produtos/editar/${produto.public_id}`}>
                <Button variant="outline-gold" size="sm">Editar</Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteModal({
                  isOpen: true,
                  publicId: produto.public_id,
                  name: produto.name,
                })}
              >
                Remover
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-brown-500">
          {search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, publicId: '', name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir "${deleteModal.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </Container>
  )
}
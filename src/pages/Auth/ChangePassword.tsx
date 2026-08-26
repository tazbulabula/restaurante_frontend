// src/pages/Auth/ChangePassword.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, showToast } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export function ChangePassword() {
  const navigate = useNavigate()
  const { user, changePassword } = useAuthStore()
  const { handleError, getFieldError, clearFieldError } = useErrorHandler()
  
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (form.new_password !== form.confirm_password) {
      showToast.error('As senhas não coincidem')
      return
    }

    if (!user?.public_id) {
      showToast.error('Usuário não autenticado')
      return
    }

    setIsLoading(true)
    try {
      await changePassword(user.public_id, {
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      })
      showToast.success('Senha alterada com sucesso!')
      navigate('/')
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error)
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    clearFieldError(name)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 py-12">
      <Card variant="gold" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-brown-800">
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Senha Atual"
              type="password"
              name="current_password"
              placeholder="••••••••"
              value={form.current_password}
              onChange={handleChange}
              error={getFieldError('current_password')}
              required
            />
            <Input
              label="Nova Senha"
              type="password"
              name="new_password"
              placeholder="••••••••"
              value={form.new_password}
              onChange={handleChange}
              error={getFieldError('new_password')}
              required
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              name="confirm_password"
              placeholder="••••••••"
              value={form.confirm_password}
              onChange={handleChange}
              error={getFieldError('confirm_password')}
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isLoading}>
              Alterar Senha
            </Button>
            <Button
              variant="outline-gold"
              type="button"
              fullWidth
              onClick={() => navigate('/')}
            >
              Cancelar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
// src/pages/Auth/Register.tsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, showToast } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const { handleError, getFieldError, clearFieldError } = useErrorHandler()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      showToast.error('As senhas não coincidem')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Aguarda o registro completo (incluindo login automático)
      const user = await register({ username: name, email, password, phone })
      
      // Aguarda o estado ser atualizado
      // O register já atualiza o estado, então podemos usar o user retornado
      showToast.success('Conta criada com sucesso!')
      
      // Redireciona baseado no tipo de usuário
      if (user?.user_type === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (error: any) {
      console.error('Erro ao registrar:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 py-12">
      <Card variant="gold" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-brown-800">
            Criar Conta
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              label="Nome"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearFieldError('username')
              }}
              error={getFieldError('username')}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearFieldError('email')
              }}
              error={getFieldError('email')}
              required
            />
            <Input
              label="Telefone"
              type="tel"
              placeholder="+244 999 999 999"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                clearFieldError('phone')
              }}
              error={getFieldError('phone')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearFieldError('password')
              }}
              error={getFieldError('password')}
              required
            />
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                clearFieldError('confirm_password')
              }}
              error={getFieldError('confirm_password')}
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isLoading}>
              Registrar
            </Button>
            <p className="text-sm text-brown-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-gold-600 hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
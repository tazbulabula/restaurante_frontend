// src/pages/Auth/Login.tsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, showToast } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { handleError, getFieldError, clearFieldError } = useErrorHandler()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Não precisa de isLoading local, usa o do store
    try {
      const user = await login(email, password)
      showToast.success('Bem-vindo de volta!')
      if (user?.user_type === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error)
      handleError(error)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 py-12">
      <Card variant="gold" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-brown-800">
            Entrar
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            <div className="text-right">
              <Link to="/esqueci-senha" className="text-sm text-gold-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="gold"
              fullWidth
              isLoading={isLoading}
            >
              Entrar
            </Button>
            <p className="text-sm text-brown-600">
              Não tem uma conta?{' '}
              <Link to="/registrar" className="text-gold-600 hover:underline font-medium">
                Registrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
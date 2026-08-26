// src/pages/Auth/ForgotPassword.tsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, showToast } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const { requestPasswordReset } = useAuthStore()
  const { handleError, clearFieldError } = useErrorHandler()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await requestPasswordReset(email)
      setIsSent(true)
      showToast.success('Email de recuperação enviado!')
    } catch (error: any) {
      console.error('Erro ao solicitar reset:', error)
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 py-12">
        <Card variant="gold" className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-brown-800">📧 Email Enviado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brown-600">
              Enviamos um link de recuperação para <strong>{email}</strong>.
            </p>
            <p className="text-brown-500 text-sm mt-2">
              Verifique sua caixa de entrada e spam.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/login" className="w-full">
              <Button variant="gold" fullWidth>
                Voltar ao Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 py-12">
      <Card variant="gold" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-brown-800">
            Recuperar Senha
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <p className="text-sm text-brown-600 text-center">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearFieldError('email')
              }}
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" variant="gold" fullWidth isLoading={isLoading}>
              Enviar Link de Recuperação
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="outline-gold" fullWidth type="button">
                Voltar ao Login
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
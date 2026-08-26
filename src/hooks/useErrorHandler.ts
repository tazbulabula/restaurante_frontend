// src/hooks/useErrorHandler.ts

import { useState } from 'react'
import { showToast } from '@/components/ui'

interface ErrorState {
  field: string
  message: string
}

export function useErrorHandler() {
  const [fieldErrors, setFieldErrors] = useState<ErrorState[]>([])

  const handleError = (error: any) => {
    // Erros da API
    if (error.response) {
      const { status, data } = error.response

      // 422 - Erros de validação do Pydantic
      if (status === 422 && data?.detail) {
        const errors: ErrorState[] = []
        
        if (Array.isArray(data.detail)) {
          data.detail.forEach((err: any) => {
            const field = err.loc?.join('.') || 'campo'
            errors.push({ field, message: err.msg })
          })
        }
        
        setFieldErrors(errors)
        
        // Exibe o primeiro erro como toast
        if (errors.length > 0) {
          showToast.error(errors[0].message)
        }
        return
      }

      // 409 - Conflito (email já existe, etc)
      if (status === 409) {
        setFieldErrors([{ field: 'email', message: data?.detail || 'Conflito' }])
        showToast.error(data?.detail || 'Conflito')
        return
      }

      // 401 - Não autorizado
      if (status === 401) {
        showToast.error('Email ou senha incorretos')
        return
      }

      // Outros erros
      const message = error.userMessage || data?.detail || 'Ocorreu um erro'
      setFieldErrors([])
      showToast.error(message)
      return
    }

    // Erro de rede
    if (error.userMessage) {
      showToast.error(error.userMessage)
    } else {
      showToast.error('Erro de conexão. Verifique sua internet.')
    }

    setFieldErrors([])
  }

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => prev.filter(e => e.field !== field))
  }

  const getFieldError = (field: string) => {
    return fieldErrors.find(e => e.field === field)?.message
  }

  return {
    handleError,
    clearFieldError,
    getFieldError,
    fieldErrors,
  }
}
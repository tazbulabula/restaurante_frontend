// src/hooks/useFormValidation.ts

import { useState, useCallback } from 'react'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
  message?: string
}

type ValidationRules = Record<string, ValidationRule[]>

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = useCallback((field: string, value: any) => {
    const fieldRules = rules[field] || []
    for (const rule of fieldRules) {
      if (rule.required && !value) {
        return rule.message || 'Este campo é obrigatório'
      }
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `Mínimo de ${rule.minLength} caracteres`
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `Máximo de ${rule.maxLength} caracteres`
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || 'Formato inválido'
      }
      if (rule.custom && !rule.custom(value)) {
        return rule.message || 'Valor inválido'
      }
    }
    return ''
  }, [rules])

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validate(field as string, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [validate])

  const validateAll = useCallback(() => {
    const newErrors: Record<string, string> = {}
    let isValid = true
    for (const field of Object.keys(rules)) {
      const error = validate(field, values[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    }
    setErrors(newErrors)
    return isValid
  }, [rules, values, validate])

  return {
    values,
    errors,
    touched,
    setValues,
    handleChange,
    validateAll,
    isValid: Object.keys(errors).length === 0,
  }
}
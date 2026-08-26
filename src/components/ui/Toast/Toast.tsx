// src/components/ui/Toast/Toast.tsx (atualizado)

import { toast } from 'react-hot-toast'

export const showToast = {
  success: (message: string, duration?: number) => {
    toast.success(message, {
      duration: duration || 4000,
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      icon: '✅',
    })
  },

  error: (message: string, duration?: number) => {
    toast.error(message, {
      duration: duration || 5000,
      style: {
        background: '#EF4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      icon: '❌',
    })
  },

  info: (message: string, duration?: number) => {
    toast(message, {
      duration: duration || 3000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      icon: 'ℹ️',
    })
  },

  warning: (message: string, duration?: number) => {
    toast(message, {
      duration: duration || 4000,
      style: {
        background: '#F59E0B',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      icon: '⚠️',
    })
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#6B7280',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    })
  },

  dismiss: (id: string) => {
    toast.dismiss(id)
  },
}
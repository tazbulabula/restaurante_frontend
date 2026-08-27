// src/components/ui/Toast/Toast.tsx

import { toast, ToastOptions } from 'react-hot-toast'
import { cn } from '@/utils/cn'

// ============================================================
// CONFIGURAÇÕES DE CORES
// ============================================================
const toastConfig = {
  success: {
    bg: 'bg-emerald-500',
    border: 'border-emerald-400',
    text: 'text-white',
    icon: '✅',
    iconBg: 'bg-emerald-600/30',
    progressBg: 'bg-emerald-300',
    defaultDuration: 4000,
  },
  error: {
    bg: 'bg-red-500',
    border: 'border-red-400',
    text: 'text-white',
    icon: '❌',
    iconBg: 'bg-red-600/30',
    progressBg: 'bg-red-300',
    defaultDuration: 5000,
  },
  warning: {
    bg: 'bg-amber-500',
    border: 'border-amber-400',
    text: 'text-white',
    icon: '⚠️',
    iconBg: 'bg-amber-600/30',
    progressBg: 'bg-amber-300',
    defaultDuration: 4000,
  },
  info: {
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    text: 'text-white',
    icon: 'ℹ️',
    iconBg: 'bg-blue-600/30',
    progressBg: 'bg-blue-300',
    defaultDuration: 3000,
  },
  loading: {
    bg: 'bg-brown-600',
    border: 'border-brown-400',
    text: 'text-white',
    icon: '⏳',
    iconBg: 'bg-brown-700/30',
    progressBg: 'bg-brown-300',
    defaultDuration: 6000,
  },
  gold: {
    bg: 'bg-gold-500',
    border: 'border-gold-400',
    text: 'text-brown-900',
    icon: '⭐',
    iconBg: 'bg-gold-400/30',
    progressBg: 'bg-gold-300',
    defaultDuration: 4000,
  },
}

// ============================================================
// OPÇÕES PADRÃO
// ============================================================
const defaultOptions: ToastOptions = {
  position: 'top-right',
  duration: 4000,
  style: {
    padding: '0',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 20px rgba(0, 0, 0, 0.05)',
    background: 'transparent',
    maxWidth: '420px',
    width: '100%',
  },
  className: '!bg-transparent !shadow-none',
}

// ============================================================
// COMPONENTE DE TOAST CUSTOMIZADO
// ============================================================
interface ToastContentProps {
  message: string | React.ReactNode
  type: keyof typeof toastConfig
  icon?: string
  duration?: number
  onDismiss?: () => void
}

function ToastContent({ message, type, icon, onDismiss }: ToastContentProps) {
  const config = toastConfig[type] || toastConfig.info

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl shadow-2xl border',
      config.bg,
      config.border,
      'min-h-[60px]'
    )}>
      {/* Progress bar animada */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className={cn('h-full', config.progressBg)}
          style={{
            animation: 'toast-progress 4s linear forwards',
          }}
        />
      </div>

      <div className="flex items-start gap-3 p-4">
        {/* Ícone */}
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          config.iconBg
        )}>
          <span className="text-lg">{icon || config.icon}</span>
        </div>

        {/* Mensagem */}
        <div className="flex-1 min-w-0">
          <div className={cn(
            'text-sm font-medium leading-relaxed',
            config.text
          )}>
            {message}
          </div>
        </div>

        {/* Botão fechar */}
        <button
          onClick={onDismiss}
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
            'hover:bg-white/10 transition-colors duration-200',
            config.text
          )}
          aria-label="Fechar"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ============================================================
// FUNÇÕES DO TOAST
// ============================================================
export const showToast = {
  success: (message: string | React.ReactNode, duration?: number) => {
    return toast.custom(
      (t) => (
        <ToastContent
          message={message}
          type="success"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      {
        ...defaultOptions,
        duration: duration || toastConfig.success.defaultDuration,
      }
    )
  },

  error: (message: string | React.ReactNode, duration?: number) => {
    return toast.custom(
      (t) => (
        <ToastContent
          message={message}
          type="error"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      {
        ...defaultOptions,
        duration: duration || toastConfig.error.defaultDuration,
      }
    )
  },

  warning: (message: string | React.ReactNode, duration?: number) => {
    return toast.custom(
      (t) => (
        <ToastContent
          message={message}
          type="warning"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      {
        ...defaultOptions,
        duration: duration || toastConfig.warning.defaultDuration,
      }
    )
  },

  info: (message: string | React.ReactNode, duration?: number) => {
    return toast.custom(
      (t) => (
        <ToastContent
          message={message}
          type="info"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      {
        ...defaultOptions,
        duration: duration || toastConfig.info.defaultDuration,
      }
    )
  },

  gold: (message: string | React.ReactNode, duration?: number) => {
    return toast.custom(
      (t) => (
        <ToastContent
          message={message}
          type="gold"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      {
        ...defaultOptions,
        duration: duration || toastConfig.gold.defaultDuration,
      }
    )
  },

  loading: (message: string | React.ReactNode, duration?: number) => {
    return toast.custom(
      (t) => (
        <ToastContent
          message={message}
          type="loading"
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      {
        ...defaultOptions,
        duration: duration || toastConfig.loading.defaultDuration,
      }
    )
  },

  dismiss: (id?: string) => {
    if (id) {
      toast.dismiss(id)
    } else {
      toast.dismiss()
    }
  },

  // Promise helper
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string | React.ReactNode
      success: string | React.ReactNode
      error: string | React.ReactNode
    },
    duration?: number
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...defaultOptions,
        duration: duration || 4000,
      }
    )
  },
}

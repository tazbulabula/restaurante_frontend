// src/components/ui/ConfirmModal/ConfirmModal.tsx

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  Sparkles,
  Shield,
  Trash2,
  Edit,
  Clock
} from 'lucide-react'
import { Button } from '../Button'
import { cn } from '@/utils/cn'

// ============================================================
// CONFIGURAÇÕES DE VARIANTE
// ============================================================
const variantConfig = {
  danger: {
    icon: <AlertCircle className="w-6 h-6" />,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    border: 'border-red-200',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    buttonText: 'Confirmar',
    titleColor: 'text-red-700',
    descriptionColor: 'text-red-600/80',
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6" />,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    border: 'border-amber-200',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    buttonText: 'Confirmar',
    titleColor: 'text-amber-700',
    descriptionColor: 'text-amber-600/80',
  },
  info: {
    icon: <Info className="w-6 h-6" />,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    border: 'border-blue-200',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    buttonText: 'OK',
    titleColor: 'text-blue-700',
    descriptionColor: 'text-blue-600/80',
  },
  success: {
    icon: <CheckCircle className="w-6 h-6" />,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-200',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
    buttonText: 'OK',
    titleColor: 'text-emerald-700',
    descriptionColor: 'text-emerald-600/80',
  },
}

// ============================================================
// ANIMAÇÕES
// ============================================================
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.15, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.15, 1] }
  }
}

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.92,
    y: 20,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      duration: 0.4
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.92,
    y: 20,
    transition: { duration: 0.2 }
  }
}

const iconVariants = {
  hidden: { scale: 0, rotate: -30 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      delay: 0.1
    }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.15,
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'success'
  isLoading?: boolean
  icon?: React.ReactNode
  cancelVariant?: 'outline-gold' | 'outline' | 'ghost'
  confirmVariant?: 'gold' | 'danger' | 'warning' | 'info'
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  icon,
  cancelVariant = 'outline-gold',
  confirmVariant = 'gold',
}: ConfirmModalProps) {
  const config = variantConfig[variant] || variantConfig.danger
  const finalConfirmText = confirmText || config.buttonText

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ============================================================ */}
        {/* BACKDROP */}
        {/* ============================================================ */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
        </Transition.Child>

        {/* ============================================================ */}
        {/* MODAL */}
        {/* ============================================================ */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel as={motion.div} className="w-full max-w-md">
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`
                    relative bg-white rounded-2xl shadow-2xl overflow-hidden
                    border-2 ${config.border}
                  `}
                >
                  {/* Top bar colorida */}
                  <div className={cn(
                    "h-1.5 w-full",
                    variant === 'danger' && 'bg-gradient-to-r from-red-400 via-red-500 to-red-400',
                    variant === 'warning' && 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400',
                    variant === 'info' && 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400',
                    variant === 'success' && 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400'
                  )} />

                  {/* ============================================================ */}
                  {/* ORBES DECORATIVAS */}
                  {/* ============================================================ */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-500/5 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gold-500/5 to-transparent rounded-full blur-2xl" />

                  <div className="relative p-6 md:p-8">
                    {/* ============================================================ */}
                    {/* ÍCONE */}
                    {/* ============================================================ */}
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex justify-center mb-4"
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center",
                        config.iconBg
                      )}>
                        {icon || config.icon}
                      </div>
                    </motion.div>

                    {/* ============================================================ */}
                    {/* CONTEÚDO */}
                    {/* ============================================================ */}
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-center"
                    >
                      <Dialog.Title className={cn(
                        "text-2xl font-display font-bold mb-2",
                        config.titleColor
                      )}>
                        {title}
                      </Dialog.Title>

                      <Dialog.Description className={cn(
                        "text-sm leading-relaxed",
                        config.descriptionColor
                      )}>
                        {message}
                      </Dialog.Description>
                    </motion.div>

                    {/* ============================================================ */}
                    {/* BOTÕES */}
                    {/* ============================================================ */}
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                      className="mt-6 flex flex-col sm:flex-row gap-3 justify-end"
                    >
                      <Button
                        variant={cancelVariant}
                        onClick={onClose}
                        disabled={isLoading}
                        className="order-2 sm:order-1"
                      >
                        {cancelText}
                      </Button>

                      <Button
                        variant={confirmVariant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className={cn(
                          "order-1 sm:order-2 font-semibold",
                          config.buttonClass
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {variant === 'danger' && <Trash2 className="w-4 h-4" />}
                          {variant === 'warning' && <AlertTriangle className="w-4 h-4" />}
                          {variant === 'info' && <Info className="w-4 h-4" />}
                          {variant === 'success' && <CheckCircle className="w-4 h-4" />}
                          {finalConfirmText}
                        </span>
                      </Button>
                    </motion.div>

                    {/* ============================================================ */}
                    {/* BADGE DE SEGURANÇA (opcional) */}
                    {/* ============================================================ */}
                    {(variant === 'danger' || variant === 'warning') && (
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.25 }}
                        className="mt-4 flex items-center justify-center gap-2 text-xs text-brown-400"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Esta ação não pode ser desfeita</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
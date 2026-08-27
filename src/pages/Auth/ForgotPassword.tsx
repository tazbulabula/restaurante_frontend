// src/pages/Auth/ForgotPassword.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Shield,
  Key,
  Send,
  Lock,
  ChefHat
} from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, CardFooter, showToast } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'
import { useErrorHandler } from '@/hooks/useErrorHandler'

// ============================================================
// ANIMAÇÕES
// ============================================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const inputVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      delay: 0.3,
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay: 0.2
    }
  }
}

const iconBounceVariants = {
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

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [touched, setTouched] = useState(false)
  
  const { requestPasswordReset } = useAuthStore()
  const { handleError, getFieldError, clearFieldError } = useErrorHandler()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isEmailValid = email.includes('@') && email.includes('.')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isEmailValid) {
      showToast.warning('Por favor, insira um email válido')
      return
    }

    setIsLoading(true)
    try {
      await requestPasswordReset(email)
      setIsSent(true)
      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Email de recuperação enviado! 📧</span>
        </div>
      )
    } catch (error: any) {
      console.error('Erro ao solicitar reset:', error)
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlur = () => {
    setTouched(true)
  }

  // ============================================================
  // TELA DE SUCESSO
  // ============================================================
  if (isSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 via-cream-100 to-gold-50/30 py-12 px-4 relative overflow-hidden">
        {/* Fundo decorativo */}
        <div className="absolute inset-0 bg-luxury-pattern opacity-5" />
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"
          animate={floatAnimation}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 15, 0],
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="w-full max-w-md relative z-10"
        >
          <Card variant="gold" className="w-full shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300" />

            <CardHeader className="text-center pt-8 pb-4">
              <motion.div
                variants={iconBounceVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-center mb-4"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <CardTitle className="text-2xl font-display text-brown-800">
                  Email Enviado! 📧
                </CardTitle>
                <p className="text-brown-500 text-sm mt-2">
                  Verifique sua caixa de entrada
                </p>
              </motion.div>
            </CardHeader>

            <CardContent className="text-center space-y-3">
              <motion.p 
                variants={fadeUp}
                className="text-brown-600"
              >
                Enviamos um link de recuperação para <br />
                <strong className="text-gold-600">{email}</strong>
              </motion.p>
              
              <motion.div 
                variants={fadeUp}
                className="p-4 bg-amber-50 rounded-xl border border-amber-200/50"
              >
                <p className="text-sm text-amber-700 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Não esqueça de verificar a pasta de spam
                </p>
              </motion.div>

              <motion.div 
                variants={fadeUp}
                className="flex items-center justify-center gap-2 text-xs text-brown-400"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Link válido por 24 horas</span>
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pb-8">
              <Link to="/login" className="w-full">
                <Button variant="gold" fullWidth className="py-3 group">
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    Voltar ao Login
                  </span>
                </Button>
              </Link>
              <button
                onClick={() => setIsSent(false)}
                className="text-sm text-gold-500 hover:text-gold-600 transition-colors"
              >
                Reenviar email
              </button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ============================================================
  // TELA DE SOLICITAÇÃO
  // ============================================================
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 via-cream-100 to-gold-50/30 py-12 px-4 relative overflow-hidden">
      
      {/* Fundo decorativo */}
      <div className="absolute inset-0 bg-luxury-pattern opacity-5" />
      
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"
        animate={floatAnimation}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, 15, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-300/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />

      {/* Card */}
      <motion.div
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
        variants={scaleIn}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="gold" className="w-full shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
          
          <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

          <CardHeader className="text-center pt-8 pb-2">
            <motion.div variants={fadeUp} className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
                <Key className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <CardTitle className="text-3xl font-display text-brown-800">
                Recuperar <span className="text-gold-500">Senha</span>
              </CardTitle>
              <p className="text-brown-500 text-sm mt-2">
                Digite seu email para receber o link de recuperação
              </p>
            </motion.div>

            <motion.div 
              variants={fadeUp}
              className="flex items-center justify-center gap-2 mt-3"
            >
              <span className="w-12 h-0.5 bg-gold-300" />
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="w-12 h-0.5 bg-gold-300" />
            </motion.div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-4">
              {/* Descrição */}
              <motion.p 
                variants={fadeUp}
                className="text-sm text-brown-600 text-center leading-relaxed"
              >
                Enviaremos um link para redefinir sua senha. 
                Verifique sua caixa de entrada e spam.
              </motion.p>

              {/* Email */}
              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearFieldError('email')
                    }}
                    onBlur={handleBlur}
                    className={`
                      w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${getFieldError('email') || (touched && !isEmailValid && email.length > 0)
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                        : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                    required
                  />
                  {touched && email.length > 0 && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {isEmailValid ? (
                        <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {getFieldError('email') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('email')}
                  </motion.p>
                )}
              </motion.div>

              {/* Dica de segurança */}
              <motion.div 
                variants={fadeUp}
                className="flex items-center justify-center gap-2 text-xs text-brown-400"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Seus dados estão seguros</span>
                <span className="w-px h-3 bg-brown-200" />
                <span>🔒 Criptografia SSL</span>
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2 pb-8">
              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                className="w-full"
              >
                <Button
                  type="submit"
                  variant="gold"
                  fullWidth
                  isLoading={isLoading}
                  className="py-3 text-lg font-semibold group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Link de Recuperação
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                className="w-full"
              >
                <Link to="/login" className="w-full">
                  <Button variant="outline" fullWidth type="button" className="border-gold-300 text-brown-600 hover:bg-gold-50/50">
                    <span className="flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Voltar ao Login
                    </span>
                  </Button>
                </Link>
              </motion.div>

              {/* Badge de ajuda */}
              <motion.div
                variants={fadeUp}
                className="text-center"
              >
                <Link 
                  to="/registrar" 
                  className="text-xs text-gold-500 hover:text-gold-600 hover:underline transition-colors"
                >
                  Não tem conta? Criar agora
                </Link>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
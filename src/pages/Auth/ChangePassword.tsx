// src/pages/Auth/ChangePassword.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Shield,
  ArrowLeft,
  Key,
  ChevronRight
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
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1 + 0.3,
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  })
}

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const passwordStrengthVariants = {
  weak: { width: '30%', backgroundColor: '#ef4444' },
  medium: { width: '60%', backgroundColor: '#f59e0b' },
  strong: { width: '100%', backgroundColor: '#22c55e' },
}

export function ChangePassword() {
  const navigate = useNavigate()
  const { user, changePassword } = useAuthStore()
  const { handleError, getFieldError, clearFieldError } = useErrorHandler()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false
  })
  
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ============================================================
  // VALIDAÇÕES
  // ============================================================
  const isCurrentPasswordValid = form.current_password.length >= 6
  const isNewPasswordValid = form.new_password.length >= 6
  const doPasswordsMatch = form.new_password === form.confirm_password && form.new_password.length > 0
  const isFormValid = isCurrentPasswordValid && isNewPasswordValid && doPasswordsMatch

  // Força da nova senha
  const getPasswordStrength = () => {
    if (form.new_password.length === 0) return null
    if (form.new_password.length < 6) return 'weak'
    if (form.new_password.length < 10) return 'medium'
    return 'strong'
  }

  const passwordStrength = getPasswordStrength()
  const strengthLabels = {
    weak: 'Fraca',
    medium: 'Média',
    strong: 'Forte'
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (form.new_password !== form.confirm_password) {
      showToast.error('As senhas não coincidem')
      return
    }

    if (form.new_password.length < 6) {
      showToast.warning('A nova senha deve ter pelo menos 6 caracteres')
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
      
      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Senha alterada com sucesso! 🔒</span>
        </div>
      )
      
      setTimeout(() => {
        navigate('/')
      }, 500)
      
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
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-cream-50 via-cream-100 to-gold-50/30 py-12 px-4 relative overflow-hidden">
      
      {/* ============================================================ */}
      {/* FUNDO DECORATIVO */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* CARD */}
      {/* ============================================================ */}
      <motion.div
        initial="hidden"
        animate={isMounted ? "visible" : "hidden"}
        variants={scaleIn}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="gold" className="w-full shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
          
          {/* Decorative top bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

          <CardHeader className="text-center pt-8 pb-2">
            <motion.div variants={fadeUp} className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/30">
                <Key className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <CardTitle className="text-3xl font-display text-brown-800">
                Alterar <span className="text-gold-500">Senha</span>
              </CardTitle>
              <p className="text-brown-500 text-sm mt-2">
                Mantenha sua conta segura com uma senha forte
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
            <CardContent className="space-y-4 pt-4">
              {/* ============================================================ */}
              {/* SENHA ATUAL */}
              {/* ============================================================ */}
              <motion.div
                custom={0}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Senha Atual *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="current_password"
                    placeholder="Digite sua senha atual"
                    value={form.current_password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('current_password')}
                    className={`
                      w-full pl-11 pr-12 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${getFieldError('current_password') || (touched.current_password && !isCurrentPasswordValid && form.current_password.length > 0)
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                        : touched.current_password && isCurrentPasswordValid && form.current_password.length > 0
                          ? 'border-green-400 focus:ring-green-400/50 focus:border-green-400'
                          : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                  {touched.current_password && form.current_password.length > 0 && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      {isCurrentPasswordValid ? (
                        <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {getFieldError('current_password') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('current_password')}
                  </motion.p>
                )}
              </motion.div>

              {/* ============================================================ */}
              {/* NOVA SENHA */}
              {/* ============================================================ */}
              <motion.div
                custom={1}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Nova Senha *
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="new_password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.new_password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('new_password')}
                    className={`
                      w-full pl-11 pr-12 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${getFieldError('new_password') || (touched.new_password && !isNewPasswordValid && form.new_password.length > 0)
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                        : touched.new_password && isNewPasswordValid && form.new_password.length > 0
                          ? 'border-green-400 focus:ring-green-400/50 focus:border-green-400'
                          : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                  {touched.new_password && form.new_password.length > 0 && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      {isNewPasswordValid ? (
                        <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Força da senha */}
                {form.new_password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-brown-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: passwordStrength === 'weak' ? '30%' :
                                   passwordStrength === 'medium' ? '60%' : '100%'
                          }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            passwordStrength === 'weak' ? 'bg-red-400' :
                            passwordStrength === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength === 'weak' ? 'text-red-400' :
                        passwordStrength === 'medium' ? 'text-amber-400' : 'text-green-400'
                      }`}>
                        {passwordStrength && strengthLabels[passwordStrength]}
                      </span>
                    </div>
                    <p className="text-xs text-brown-400">
                      {form.new_password.length < 6 ? 'Mínimo 6 caracteres' : 
                       form.new_password.length < 10 ? 'Adicione mais caracteres para uma senha forte' : 
                       'Senha forte! ✅'}
                    </p>
                  </motion.div>
                )}

                {getFieldError('new_password') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('new_password')}
                  </motion.p>
                )}
              </motion.div>

              {/* ============================================================ */}
              {/* CONFIRMAR NOVA SENHA */}
              {/* ============================================================ */}
              <motion.div
                custom={2}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
              >
                <label className="block text-sm font-medium text-brown-700 mb-1.5">
                  Confirmar Nova Senha *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="Digite a nova senha novamente"
                    value={form.confirm_password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('confirm_password')}
                    className={`
                      w-full pl-11 pr-12 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800 placeholder-brown-400
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${getFieldError('confirm_password') || (touched.confirm_password && !doPasswordsMatch && form.confirm_password.length > 0)
                        ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                        : touched.confirm_password && doPasswordsMatch && form.confirm_password.length > 0
                          ? 'border-green-400 focus:ring-green-400/50 focus:border-green-400'
                          : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                  {touched.confirm_password && form.confirm_password.length > 0 && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      {doPasswordsMatch ? (
                        <CheckCircle className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {touched.confirm_password && form.confirm_password.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm mt-1.5 flex items-center gap-1 ${
                      doPasswordsMatch ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {doPasswordsMatch ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Senhas coincidem
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        As senhas não coincidem
                      </>
                    )}
                  </motion.p>
                )}
                {getFieldError('confirm_password') && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {getFieldError('confirm_password')}
                  </motion.p>
                )}
              </motion.div>

              {/* Dica de segurança */}
              <motion.div 
                variants={fadeUp}
                className="flex items-center justify-center gap-2 text-xs text-brown-400 pt-2"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Recomendamos uma senha forte e única</span>
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2 pb-8">
              <motion.div
                custom={3}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
                className="w-full"
              >
                <Button
                  type="submit"
                  variant="gold"
                  fullWidth
                  isLoading={isLoading}
                  disabled={!isFormValid}
                  className="py-3 text-lg font-semibold group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Alterando...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        Alterar Senha
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>

              <motion.div
                custom={4}
                initial="hidden"
                animate={isMounted ? "visible" : "hidden"}
                variants={inputVariants}
                className="w-full"
              >
                <Button
                  variant="outline"
                  type="button"
                  fullWidth
                  onClick={() => navigate(-1)}
                  className="border-gold-300 text-brown-600 hover:bg-gold-50/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Cancelar
                  </span>
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
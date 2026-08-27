// src/pages/Reservas/NovaReserva.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Users, 
  User, 
  Phone, 
  MessageSquare,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Table,
  ChefHat,
  CalendarDays,
  Clock4,
  Utensils,
  MapPin
} from 'lucide-react'
import { Container, Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, showToast, Spinner } from '@/components/ui'
import { reservasApi } from '@/api/reservas'
import { mesasApi } from '@/api/mesas'
import { useAuthStore } from '@/store/authStore'
import type { Mesa } from '@/types/mesa.types'

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
}

const inputVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06 + 0.2,
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

export function NovaReserva() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMesas, setIsLoadingMesas] = useState(true)
  const [mesasDisponiveis, setMesasDisponiveis] = useState<Mesa[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [touched, setTouched] = useState({
    mesa_id: false,
    data: false,
    hora: false,
    numero_pessoas: false,
    cliente_nome: false,
    cliente_telefone: false
  })

  const [form, setForm] = useState({
    mesa_id: 0,
    data: '',
    hora: '',
    numero_pessoas: 2,
    cliente_nome: user?.username || '',
    cliente_telefone: user?.phone || '',
    observacoes: '',
  })

  useEffect(() => {
    setIsMounted(true)
    carregarMesasDisponiveis()
  }, [])

  const carregarMesasDisponiveis = async () => {
    setIsLoadingMesas(true)
    try {
      const data = await mesasApi.listar({ disponivel: true })
      setMesasDisponiveis(data)
    } catch (error) {
      console.error('Erro ao carregar mesas:', error)
      showToast.error('Erro ao carregar mesas disponíveis')
    } finally {
      setIsLoadingMesas(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // ============================================================
  // VALIDAÇÕES
  // ============================================================
  const isMesaValid = form.mesa_id > 0
  const isDataValid = form.data.length > 0
  const isHoraValid = form.hora.length > 0
  const isNomeValid = form.cliente_nome.length >= 2
  const isTelefoneValid = form.cliente_telefone.replace(/\D/g, '').length >= 9
  const isPessoasValid = form.numero_pessoas >= 1 && form.numero_pessoas <= 20

  const isFormValid = isMesaValid && isDataValid && isHoraValid && isNomeValid && isTelefoneValid && isPessoasValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      showToast.warning('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)

    try {
      const dataHora = `${form.data}T${form.hora}:00`

      const reservaData = {
        mesa_id: Number(form.mesa_id),
        data_hora: dataHora,
        numero_pessoas: form.numero_pessoas,
        cliente_nome: form.cliente_nome,
        cliente_telefone: form.cliente_telefone,
        observacoes: form.observacoes,
      }

      await reservasApi.criar(reservaData)
      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Reserva criada com sucesso! 🎉</span>
        </div>
      )
      navigate('/reservas/minhas')
    } catch (error: any) {
      console.error('Erro ao criar reserva:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar reserva')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================
  // LOADING MESAS
  // ============================================================
  if (isLoadingMesas) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Table className="w-6 h-6 text-gold-400" />
          </div>
        </div>
        <p className="text-brown-500 mt-4">Carregando mesas disponíveis...</p>
      </Container>
    )
  }

  // ============================================================
  // FORMULÁRIO
  // ============================================================
  return (
    <div className="min-h-screen bg-cream-50 py-8 md:py-12">
      <Container>
        
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Nova <span className="text-gold-500">Reserva</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    Reserve sua mesa para uma experiência única
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/reservas/minhas')}
              className="inline-flex items-center gap-2 text-brown-500 hover:text-gold-600 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Minhas Reservas</span>
            </button>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* CARD */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          variants={scaleIn}
          className="max-w-2xl mx-auto"
        >
          <Card variant="gold" className="shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-display text-brown-800 flex items-center gap-2">
                <Table className="w-6 h-6 text-gold-500" />
                Preencha os <span className="text-gold-500">dados</span>
              </CardTitle>
              <p className="text-sm text-brown-500">
                Selecione a mesa e o horário para sua reserva
              </p>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5 pt-4">
                
                {/* ============================================================ */}
                {/* MESA */}
                {/* ============================================================ */}
                <motion.div
                  custom={0}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Table className="w-4 h-4 inline mr-2 text-gold-500" />
                    Mesa *
                  </label>
                  <select
                    name="mesa_id"
                    value={form.mesa_id}
                    onChange={handleChange}
                    onBlur={() => handleBlur('mesa_id')}
                    className={`
                      w-full px-4 py-3 bg-cream-50/50 border rounded-xl 
                      text-brown-800
                      focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                      transition-all duration-300
                      ${touched.mesa_id && !isMesaValid
                        ? 'border-red-400 focus:ring-red-400/50'
                        : 'border-cream-200 hover:border-gold-300'
                      }
                    `}
                    required
                  >
                    <option value="">Selecione uma mesa</option>
                    {mesasDisponiveis.map(mesa => (
                      <option key={mesa.id} value={mesa.id}>
                        Mesa {mesa.numero} - {mesa.capacidade} pessoas {mesa.localizacao ? `(${mesa.localizacao})` : ''}
                      </option>
                    ))}
                  </select>
                  {touched.mesa_id && !isMesaValid && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Selecione uma mesa disponível
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* DATA E HORA */}
                {/* ============================================================ */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    custom={1}
                    variants={inputVariants}
                    initial="hidden"
                    animate={isMounted ? "visible" : "hidden"}
                  >
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">
                      <Calendar className="w-4 h-4 inline mr-2 text-gold-500" />
                      Data *
                    </label>
                    <input
                      type="date"
                      name="data"
                      value={form.data}
                      onChange={handleChange}
                      onBlur={() => handleBlur('data')}
                      className={`
                        w-full px-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.data && !isDataValid
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                    {touched.data && !isDataValid && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Selecione uma data
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    custom={2}
                    variants={inputVariants}
                    initial="hidden"
                    animate={isMounted ? "visible" : "hidden"}
                  >
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">
                      <Clock className="w-4 h-4 inline mr-2 text-gold-500" />
                      Horário *
                    </label>
                    <input
                      type="time"
                      name="hora"
                      value={form.hora}
                      onChange={handleChange}
                      onBlur={() => handleBlur('hora')}
                      className={`
                        w-full px-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.hora && !isHoraValid
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                    {touched.hora && !isHoraValid && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Selecione um horário
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* ============================================================ */}
                {/* NÚMERO DE PESSOAS */}
                {/* ============================================================ */}
                <motion.div
                  custom={3}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Users className="w-4 h-4 inline mr-2 text-gold-500" />
                    Número de Pessoas *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="numero_pessoas"
                      min={1}
                      max={20}
                      value={form.numero_pessoas}
                      onChange={handleChange}
                      onBlur={() => handleBlur('numero_pessoas')}
                      className={`
                        w-full px-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.numero_pessoas && !isPessoasValid
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <span className="text-xs text-brown-400">
                        {form.numero_pessoas > 1 ? `${form.numero_pessoas} pessoas` : `${form.numero_pessoas} pessoa`}
                      </span>
                    </div>
                  </div>
                  {touched.numero_pessoas && !isPessoasValid && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Número de pessoas inválido (1-20)
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* NOME E TELEFONE */}
                {/* ============================================================ */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    custom={4}
                    variants={inputVariants}
                    initial="hidden"
                    animate={isMounted ? "visible" : "hidden"}
                  >
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">
                      <User className="w-4 h-4 inline mr-2 text-gold-500" />
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="cliente_nome"
                      value={form.cliente_nome}
                      onChange={handleChange}
                      onBlur={() => handleBlur('cliente_nome')}
                      placeholder="Seu nome completo"
                      className={`
                        w-full px-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.cliente_nome && !isNomeValid
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                    {touched.cliente_nome && !isNomeValid && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Nome deve ter pelo menos 2 caracteres
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    custom={5}
                    variants={inputVariants}
                    initial="hidden"
                    animate={isMounted ? "visible" : "hidden"}
                  >
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">
                      <Phone className="w-4 h-4 inline mr-2 text-gold-500" />
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="cliente_telefone"
                      value={form.cliente_telefone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('cliente_telefone')}
                      placeholder="+244 999 999 999"
                      className={`
                        w-full px-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.cliente_telefone && !isTelefoneValid
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                    {touched.cliente_telefone && !isTelefoneValid && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Telefone inválido
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* ============================================================ */}
                {/* OBSERVAÇÕES */}
                {/* ============================================================ */}
                <motion.div
                  custom={6}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <MessageSquare className="w-4 h-4 inline mr-2 text-gold-500" />
                    Observações <span className="text-brown-400 text-xs">(opcional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-4 w-4.5 h-4.5 text-brown-400" />
                    <textarea
                      name="observacoes"
                      value={form.observacoes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300 resize-none"
                      placeholder="Alguma observação para a reserva? (ex: preferências, alergias)"
                    />
                  </div>
                </motion.div>

                {/* ============================================================ */}
                {/* DICA */}
                {/* ============================================================ */}
                <motion.div
                  custom={7}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                  className="p-4 bg-gold-50/50 rounded-xl border border-gold-200/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-sm text-brown-700 font-medium">
                        Reserve com antecedência
                      </p>
                      <p className="text-xs text-brown-500">
                        Recomendamos reservar com pelo menos 2 horas de antecedência para garantir sua mesa.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
                <Button
                  type="submit"
                  variant="gold"
                  fullWidth
                  isLoading={isLoading}
                  disabled={!isFormValid}
                  className="py-3.5 text-lg font-semibold group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Criando Reserva...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirmar Reserva
                      </>
                    )}
                  </span>
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-brown-400">
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-500">✓</span>
                    Confirmação imediata
                  </span>
                  <span className="w-px h-3 bg-brown-200" />
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-500">✓</span>
                    Sem custo
                  </span>
                  <span className="w-px h-3 bg-brown-200" />
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-500">✓</span>
                    Cancelamento grátis
                  </span>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}
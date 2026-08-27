// src/pages/Pagamento/index.tsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone, 
  DollarSign, 
  Landmark, 
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Shield,
  Clock,
  User,
  Phone,
  Wallet,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import { Container, Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, Spinner, Divider, showToast } from '@/components/ui'
import { pagamentoApi } from '@/api/pagamento'
import { pedidosApi } from '@/api/pedidos'
import { useAuthStore } from '@/store/authStore'
import type { Pedido } from '@/types/pedido.types'

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
      delayChildren: 0.2
    }
  }
}

const methodVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  },
  hover: {
    y: -4,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 }
  }
}

const iconVariants = {
  hover: {
    scale: 1.15,
    rotate: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      delay: 0.2
    }
  }
}

// ============================================================
// CONFIGURAÇÕES
// ============================================================
const METODOS_PAGAMENTO = [
  { 
    value: 'emis', 
    label: 'Multicaixa Express', 
    icon: <Smartphone className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    description: 'Pague pelo app Multicaixa Express',
    badge: 'Popular'
  },
  { 
    value: 'dinheiro', 
    label: 'Dinheiro', 
    icon: <DollarSign className="w-6 h-6" />,
    color: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    description: 'Pague em espécie no restaurante'
  },
  { 
    value: 'transferencia', 
    label: 'Transferência', 
    icon: <Landmark className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    description: 'Transferência bancária',
    badge: 'Novo'
  },
  { 
    value: 'pos', 
    label: 'POS (Cartão)', 
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-amber-500 to-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    description: 'Cartão de débito/crédito'
  },
]

export function Pagamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [metodoSelecionado, setMetodoSelecionado] = useState<string | null>(null)
  const [telefone, setTelefone] = useState(user?.phone || '')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [touched, setTouched] = useState(false)

  const pedidoPublicId = location.state?.pedidoPublicId || 
    new URLSearchParams(location.search).get('pedido')

  useEffect(() => {
    if (!pedidoPublicId) {
      showToast.error('Nenhum pedido encontrado')
      navigate('/cardapio')
      return
    }
    carregarPedido()
  }, [pedidoPublicId])

  const carregarPedido = async () => {
    setIsLoading(true)
    try {
      const data = await pedidosApi.buscarPorPublicId(pedidoPublicId)
      setPedido(data)
    } catch (error) {
      console.error('Erro ao carregar pedido:', error)
      showToast.error('Erro ao carregar pedido')
      navigate('/cardapio')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePagamento = async () => {
    if (!metodoSelecionado || !pedido) return

    if (metodoSelecionado === 'emis' && !telefone) {
      setTouched(true)
      showToast.warning('Por favor, insira seu telefone Multicaixa Express')
      return
    }

    setIsProcessing(true)

    try {
      if (metodoSelecionado === 'emis') {
        await pagamentoApi.iniciar({
          pedido_public_id: pedido.public_id,
          telefone,
        })
        
        setIsSuccess(true)
        showToast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Pagamento iniciado! Aguarde confirmação no Multicaixa Express. 📱</span>
          </div>,
          { duration: 5000 }
        )
        
        setTimeout(() => {
          navigate('/pedidos/meus', { 
            state: { 
              message: 'Pagamento via Multicaixa Express iniciado. Aguarde confirmação.' 
            }
          })
        }, 3000)
        
      } else {
        await pedidosApi.selecionarMetodoPagamento(pedido.public_id, metodoSelecionado)
        
        const metodoLabel = METODOS_PAGAMENTO.find(m => m.value === metodoSelecionado)?.label
        
        setIsSuccess(true)
        showToast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>✅ Pedido registrado! Pague em {metodoLabel} no restaurante.</span>
          </div>,
          { duration: 4000 }
        )
        
        setTimeout(() => {
          navigate('/pedidos/meus', { 
            state: { 
              message: `Pagamento em ${metodoLabel} aguardando confirmação.`
            }
          })
        }, 2500)
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao processar pagamento')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <Container className="py-20 flex justify-center items-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-brown-500 mt-4">Carregando informações do pedido...</p>
        </div>
      </Container>
    )
  }

  if (!pedido) {
    return (
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-display text-brown-800 mb-2">
            Pedido não encontrado
          </h2>
          <p className="text-brown-500 mb-6">
            Não foi possível encontrar os detalhes do seu pedido.
          </p>
          <Link to="/cardapio">
            <Button variant="gold" className="group">
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Cardápio
              </span>
            </Button>
          </Link>
        </motion.div>
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8 md:py-12">
      <Container>
        
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                💳 <span className="text-gold-500">Pagamento</span>
              </h1>
              <p className="text-brown-500 text-sm mt-1">
                Pedido #{pedido.id} • {pedido.itens?.length || 0} itens
              </p>
            </div>
            <Link to="/carrinho">
              <Button variant="outline" className="border-gold-300 text-brown-600 hover:bg-gold-50/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* CARD PRINCIPAL */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="max-w-2xl mx-auto"
        >
          <Card variant="gold" className="shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
            
            {/* Top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-display text-brown-800">
                    Escolha o <span className="text-gold-500">método</span> de pagamento
                  </CardTitle>
                  <p className="text-brown-500 text-sm mt-1">
                    Selecione a forma de pagamento preferida
                  </p>
                </div>
                <motion.div
                  animate={floatAnimation}
                  className="hidden sm:block text-4xl"
                >
                  💳
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              
              {/* ============================================================ */}
              {/* MÉTODOS DE PAGAMENTO */}
              {/* ============================================================ */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {METODOS_PAGAMENTO.map((metodo) => (
                  <motion.div
                    key={metodo.value}
                    variants={methodVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setMetodoSelecionado(metodo.value)}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer 
                      transition-all duration-300 group
                      ${metodoSelecionado === metodo.value
                        ? `border-gold-500 bg-gold-50 shadow-lg shadow-gold-500/10`
                        : `border-cream-200 hover:border-gold-300 hover:bg-cream-50/50`
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        variants={iconVariants}
                        className={`
                          w-12 h-12 rounded-xl flex items-center justify-center
                          ${metodoSelecionado === metodo.value
                            ? 'bg-gold-500 text-white'
                            : 'bg-cream-100 text-brown-400 group-hover:text-gold-500'
                          }
                          transition-all duration-300
                        `}
                      >
                        {metodo.icon}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${
                            metodoSelecionado === metodo.value
                              ? 'text-gold-700'
                              : 'text-brown-800'
                          }`}>
                            {metodo.label}
                          </h3>
                          {metodo.badge && (
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              metodo.badge === 'Popular' 
                                ? 'bg-gold-500 text-white'
                                : 'bg-emerald-500 text-white'
                            }`}>
                              {metodo.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-brown-400">
                          {metodo.description}
                        </p>
                      </div>
                      {metodoSelecionado === metodo.value && (
                        <motion.div
                          variants={checkmarkVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex-shrink-0"
                        >
                          <CheckCircle className="w-5 h-5 text-gold-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ============================================================ */}
              {/* CAMPO TELEFONE (EMIS) */}
              {/* ============================================================ */}
              <AnimatePresence>
                {metodoSelecionado === 'emis' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <label className="block text-sm font-medium text-purple-700 mb-1.5">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Telefone Multicaixa Express *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-purple-400" />
                        <input
                          type="tel"
                          placeholder="+244 999 999 999"
                          value={telefone}
                          onChange={(e) => {
                            setTelefone(e.target.value)
                            setTouched(false)
                          }}
                          className={`
                            w-full pl-11 pr-4 py-3 bg-white border rounded-xl 
                            text-brown-800 placeholder-brown-400
                            focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400
                            transition-all duration-300
                            ${touched && !telefone
                              ? 'border-red-400 focus:ring-red-400/50'
                              : 'border-purple-200 hover:border-purple-300'
                            }
                          `}
                          required
                        />
                      </div>
                      {touched && !telefone && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          O telefone é obrigatório para pagamento via Multicaixa Express
                        </motion.p>
                      )}
                      <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Seu número será usado apenas para processar o pagamento
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ============================================================ */}
              {/* INSTRUÇÕES PARA PAGAMENTO MANUAL */}
              {/* ============================================================ */}
              <AnimatePresence>
                {metodoSelecionado && metodoSelecionado !== 'emis' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">
                          Pagamento no restaurante
                        </p>
                        <p className="text-xs text-blue-600">
                          Você será redirecionado para finalizar o pedido. 
                          Pague no restaurante utilizando o método selecionado.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ============================================================ */}
              {/* RESUMO DO PEDIDO */}
              {/* ============================================================ */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-brown-50 to-cream-50 p-4 rounded-xl border border-brown-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brown-500">Total a pagar</p>
                    <p className="text-2xl font-bold text-gold-600">
                      {pedido.total.toLocaleString('pt-AO')} Kz
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-brown-400">
                      {pedido.itens?.length || 0} {pedido.itens?.length === 1 ? 'item' : 'itens'}
                    </p>
                    <p className="text-xs text-brown-400 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      Pedido #{pedido.id}
                    </p>
                  </div>
                </div>
              </motion.div>
            </CardContent>

            {/* ============================================================ */}
            {/* FOOTER */}
            {/* ============================================================ */}
            <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
              <Button
                variant="gold"
                fullWidth
                onClick={handlePagamento}
                isLoading={isProcessing}
                disabled={
                  !metodoSelecionado || 
                  (metodoSelecionado === 'emis' && !telefone) ||
                  isSuccess
                }
                className="py-3.5 text-lg font-semibold group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processando...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Pagamento Confirmado!
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      {metodoSelecionado === 'emis'
                        ? 'Pagar com Multicaixa Express'
                        : `Confirmar Pagamento`
                      }
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs text-brown-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Pagamento seguro
                </span>
                <span className="w-px h-3 bg-brown-200" />
                <span>🔒 Criptografia SSL</span>
                <span className="w-px h-3 bg-brown-200" />
                <span>✅ Transação protegida</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}
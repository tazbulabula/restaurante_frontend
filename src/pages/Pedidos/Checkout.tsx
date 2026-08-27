// src/pages/Pedidos/Checkout.tsx

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Receipt,
  CreditCard,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  Wallet,
  ChefHat
} from 'lucide-react'
import { Container, Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input, Divider, showToast } from '@/components/ui'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { pedidosApi } from '@/api/pedidos'

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

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const summaryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.9 },
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

const inputVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08 + 0.2,
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  })
}

export function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [touched, setTouched] = useState({
    nome: false,
    telefone: false
  })
  
  const [form, setForm] = useState({
    nome: user?.username || '',
    telefone: user?.phone || '',
    observacoes: '',
  })

  const taxaServico = total * 0.1
  const totalFinal = total + taxaServico
  const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ============================================================
  // VALIDAÇÕES
  // ============================================================
  const isNomeValid = form.nome.length >= 2
  const isTelefoneValid = form.telefone.replace(/\D/g, '').length >= 9
  const isFormValid = isNomeValid && isTelefoneValid

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      showToast.warning('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)

    try {
      const pedidoData = {
        mesa_numero: 1,
        cliente_nome: form.nome,
        cliente_telefone: form.telefone,
        observacoes: form.observacoes,
        itens: items.map(item => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
        })),
      }

      const pedido = await pedidosApi.criar(pedidoData)

      clearCart()

      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Pedido criado com sucesso! 🎉</span>
        </div>
      )

      navigate('/pagamento', {
        state: { pedidoPublicId: pedido.public_id }
      })

    } catch (error: any) {
      console.error('Erro ao criar pedido:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar pedido')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================
  // CARRINHO VAZIO
  // ============================================================
  if (items.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <motion.div
          variants={emptyVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto"
        >
          <Card className="text-center py-16 px-6 bg-gradient-to-br from-cream-50 to-gold-50/30 border-2 border-gold-200/30">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-7xl mb-6"
            >
              🛒
            </motion.div>
            
            <h2 className="text-3xl font-display text-brown-800 mb-3">
              Carrinho <span className="text-gold-500">vazio</span>
            </h2>
            <p className="text-brown-500 mb-8 max-w-sm mx-auto">
              Adicione itens ao carrinho antes de finalizar seu pedido.
            </p>
            <Link to="/cardapio">
              <Button variant="gold" className="group text-lg px-8 py-3">
                <span className="flex items-center gap-2">
                  Ver Cardápio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </Card>
        </motion.div>
      </Container>
    )
  }

  // ============================================================
  // CHECKOUT
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
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Finalizar <span className="text-gold-500">Pedido</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
                  </p>
                </div>
              </div>
            </div>
            <Link to="/carrinho">
              <Button variant="outline" className="border-gold-300 text-brown-600 hover:bg-gold-50/50 group">
                <span className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Voltar ao Carrinho
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* GRID PRINCIPAL */}
        {/* ============================================================ */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ============================================================ */}
          {/* FORMULÁRIO */}
          {/* ============================================================ */}
          <motion.div 
            className="lg:col-span-2"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <Card variant="gold" className="shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
              
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-display text-brown-800 flex items-center gap-2">
                  <User className="w-6 h-6 text-gold-500" />
                  Dados do <span className="text-gold-500">Pedido</span>
                </CardTitle>
                <p className="text-sm text-brown-500">
                  Preencha os dados abaixo para finalizar seu pedido
                </p>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5 pt-4">
                  
                  {/* Nome */}
                  <motion.div
                    custom={0}
                    variants={inputVariants}
                    initial="hidden"
                    animate={isMounted ? "visible" : "hidden"}
                  >
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                      <input
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        onBlur={() => handleBlur('nome')}
                        placeholder="Seu nome completo"
                        className={`
                          w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                          text-brown-800 placeholder-brown-400
                          focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                          transition-all duration-300
                          ${touched.nome && !isNomeValid && form.nome.length > 0
                            ? 'border-red-400 focus:ring-red-400/50'
                            : 'border-cream-200 hover:border-gold-300'
                          }
                        `}
                        required
                      />
                    </div>
                    {touched.nome && !isNomeValid && form.nome.length > 0 && (
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

                  {/* Telefone */}
                  <motion.div
                    custom={1}
                    variants={inputVariants}
                    initial="hidden"
                    animate={isMounted ? "visible" : "hidden"}
                  >
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">
                      Telefone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                      <input
                        type="tel"
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('telefone')}
                        placeholder="+244 999 999 999"
                        className={`
                          w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                          text-brown-800 placeholder-brown-400
                          focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                          transition-all duration-300
                          ${touched.telefone && !isTelefoneValid && form.telefone.length > 0
                            ? 'border-red-400 focus:ring-red-400/50'
                            : 'border-cream-200 hover:border-gold-300'
                          }
                        `}
                        required
                      />
                    </div>
                    {touched.telefone && !isTelefoneValid && form.telefone.length > 0 && (
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

                  {/* Observações */}
                  <motion.div
                    custom={2}
                    variants={inputVariants}
                    initial="hidden"
                    animate={isMounted ? "visible" : "hidden"}
                  >
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">
                      Observações <span className="text-brown-400 text-xs">(opcional)</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-4 w-4.5 h-4.5 text-brown-400" />
                      <textarea
                        name="observacoes"
                        value={form.observacoes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-11 pr-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl 
                          text-brown-800 placeholder-brown-400
                          focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                          transition-all duration-300 resize-none"
                        placeholder="Alguma observação sobre o pedido? (ex: preferências, alergias)"
                      />
                    </div>
                  </motion.div>

                  {/* Dica */}
                  <motion.div
                    custom={3}
                    variants={inputVariants}
                    initial="hidden"
                    animate={isMounted ? "visible" : "hidden"}
                    className="p-4 bg-gold-50/50 rounded-xl border border-gold-200/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                        <ChefHat className="w-4 h-4 text-gold-600" />
                      </div>
                      <div>
                        <p className="text-sm text-brown-700 font-medium">
                          Pronto para degustar?
                        </p>
                        <p className="text-xs text-brown-500">
                          Após finalizar, você será direcionado para a página de pagamento.
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
                          Criando Pedido...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5" />
                          Confirmar Pedido
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          {/* ============================================================ */}
          {/* RESUMO */}
          {/* ============================================================ */}
          <motion.div
            variants={summaryVariants}
            initial="hidden"
            animate="visible"
            className="lg:sticky lg:top-24"
          >
            <Card variant="gold" className="shadow-2xl shadow-gold-500/10 border-2 border-gold-200/30 backdrop-blur-sm bg-white/95 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
              
              <div className="p-6">
                <h3 className="text-xl font-display text-brown-800 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gold-500" />
                  Resumo do Pedido
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <motion.div
                      key={item.produto_id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex justify-between text-sm text-brown-600 py-1.5 border-b border-cream-50 last:border-0"
                    >
                      <span className="flex items-center gap-1">
                        <span className="text-gold-500 font-medium">{item.quantidade}x</span>
                        {item.name}
                      </span>
                      <span className="font-medium">
                        {(item.price * item.quantidade).toLocaleString('pt-AO')} Kz
                      </span>
                    </motion.div>
                  ))}
                </div>

                <Divider className="my-3" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-brown-600">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-brown-400" />
                      Subtotal
                    </span>
                    <span className="font-medium">{total.toLocaleString('pt-AO')} Kz</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-brown-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-brown-400" />
                      Taxa de serviço (10%)
                    </span>
                    <span className="font-medium">{taxaServico.toLocaleString('pt-AO')} Kz</span>
                  </div>
                  
                  <Divider className="my-2" />
                  
                  <div className="flex justify-between text-lg font-bold text-brown-800">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-5 h-5 text-gold-500" />
                      Total
                    </span>
                    <span className="text-gold-600 text-xl">
                      {totalFinal.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                  <p className="text-xs text-brown-400 text-right">
                    Taxa de serviço incluída
                  </p>
                </div>

                {/* Badges de confiança */}
                <div className="mt-4 pt-4 border-t border-cream-200/50">
                  <div className="flex items-center justify-center gap-4 text-xs text-brown-400">
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500">✓</span>
                      Pagamento seguro
                    </span>
                    <span className="w-px h-3 bg-brown-200" />
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500">✓</span>
                      Entrega rápida
                    </span>
                    <span className="w-px h-3 bg-brown-200" />
                    <span className="flex items-center gap-1">
                      <span className="text-emerald-500">✓</span>
                      Suporte 24/7
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
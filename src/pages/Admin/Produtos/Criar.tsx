// src/pages/Admin/Produtos/Criar.tsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Package, 
  Tag, 
  DollarSign, 
  LayoutGrid,
  List,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
  Utensils,
  Coffee,
  Wine,
  Cake,
  Pizza,
  Salad,
  Beef,
  Fish,
  Egg,
  Leaf,
  Loader2
} from 'lucide-react'
import { Container, Card, CardContent, CardFooter, Button, Input, showToast } from '@/components/ui'
import { produtosApi } from '@/api/produtos'

// ============================================================
// CONFIGURAÇÕES DE CATEGORIA
// ============================================================
const categorias = [
  { value: 'principal', label: 'Principal', icon: <Beef className="w-4 h-4" /> },
  { value: 'entrada', label: 'Entrada', icon: <Utensils className="w-4 h-4" /> },
  { value: 'sobremesa', label: 'Sobremesa', icon: <Cake className="w-4 h-4" /> },
  { value: 'bebida', label: 'Bebida', icon: <Coffee className="w-4 h-4" /> },
  { value: 'refrigerante', label: 'Refrigerante', icon: <Coffee className="w-4 h-4" /> },
  { value: 'sucos', label: 'Sucos', icon: <Leaf className="w-4 h-4" /> },
  { value: 'cerveja', label: 'Cerveja', icon: <Wine className="w-4 h-4" /> },
  { value: 'cafe', label: 'Café', icon: <Coffee className="w-4 h-4" /> },
  { value: 'petisco', label: 'Petisco', icon: <Utensils className="w-4 h-4" /> },
  { value: 'porcoes', label: 'Porções', icon: <Utensils className="w-4 h-4" /> },
  { value: 'doces', label: 'Doces', icon: <Cake className="w-4 h-4" /> },
  { value: 'salgados', label: 'Salgados', icon: <Utensils className="w-4 h-4" /> },
]

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
      delay: i * 0.06 + 0.2,
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  })
}

interface ProdutoForm {
  name: string
  description: string
  price: string
  category: string
  subcategory: string
  is_available: boolean
}

export function AdminProdutosCriar() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [touched, setTouched] = useState({
    name: false,
    price: false,
    description: false,
    subcategory: false,
  })

  const [form, setForm] = useState<ProdutoForm>({
    name: '',
    description: '',
    price: '',
    category: 'principal',
    subcategory: '',
    is_available: true,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ============================================================
  // VALIDAÇÕES
  // ============================================================
  const isNameValid = form.name.length >= 2
  const isPriceValid = form.price.length > 0 && Number(form.price) > 0
  const isDescriptionValid = form.description.length === 0 || form.description.length >= 10
  const isSubcategoryValid = form.subcategory.length === 0 || form.subcategory.length >= 2

  const isFormValid = isNameValid && isPriceValid && isDescriptionValid && isSubcategoryValid

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      showToast.warning('Por favor, preencha todos os campos obrigatórios corretamente')
      return
    }

    setIsLoading(true)

    try {
      const produtoData = {
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        category: form.category,
        subcategory: form.subcategory || undefined,
        is_available: form.is_available,
      }

      await produtosApi.criar(produtoData)
      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Produto criado com sucesso! 🎉</span>
        </div>
      )
      navigate('/admin/produtos')
    } catch (error: any) {
      console.error('Erro ao criar produto:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao criar produto')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }))
  }

  const getCategoryIcon = (category: string) => {
    const found = categorias.find(c => c.value === category)
    return found?.icon || <LayoutGrid className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8 md:py-12">
      <Container>
        
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Novo <span className="text-gold-500">Produto</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    Adicione um novo produto ao cardápio
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/produtos')}
              className="inline-flex items-center gap-2 text-brown-500 hover:text-gold-600 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar</span>
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

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5 pt-6">
                
                {/* ============================================================ */}
                {/* NOME */}
                {/* ============================================================ */}
                <motion.div
                  custom={0}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Tag className="w-4 h-4 inline mr-2 text-gold-500" />
                    Nome do Produto *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      placeholder="Ex: Filé à Parmegiana"
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.name && !isNameValid && form.name.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                  </div>
                  {touched.name && !isNameValid && form.name.length > 0 && (
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

                {/* ============================================================ */}
                {/* DESCRIÇÃO */}
                {/* ============================================================ */}
                <motion.div
                  custom={1}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <List className="w-4 h-4 inline mr-2 text-gold-500" />
                    Descrição <span className="text-brown-400 text-xs">(opcional)</span>
                  </label>
                  <div className="relative">
                    <List className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-brown-400" />
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      onBlur={() => handleBlur('description')}
                      rows={3}
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300 resize-none
                        ${touched.description && !isDescriptionValid && form.description.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      placeholder="Descrição detalhada do produto..."
                    />
                  </div>
                  {touched.description && !isDescriptionValid && form.description.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Descrição deve ter pelo menos 10 caracteres
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* PREÇO */}
                {/* ============================================================ */}
                <motion.div
                  custom={2}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <DollarSign className="w-4 h-4 inline mr-2 text-gold-500" />
                    Preço (Kz) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      onBlur={() => handleBlur('price')}
                      placeholder="0.00"
                      step="0.01"
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.price && !isPriceValid && form.price.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                  </div>
                  {touched.price && !isPriceValid && form.price.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Preço deve ser maior que zero
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* CATEGORIA */}
                {/* ============================================================ */}
                <motion.div
                  custom={3}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <LayoutGrid className="w-4 h-4 inline mr-2 text-gold-500" />
                    Categoria *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getCategoryIcon(form.category)}
                    </div>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-brown-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white transition-all duration-300 appearance-none"
                    >
                      {categorias.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* ============================================================ */}
                {/* SUBCATEGORIA */}
                {/* ============================================================ */}
                <motion.div
                  custom={4}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <List className="w-4 h-4 inline mr-2 text-gold-500" />
                    Subcategoria <span className="text-brown-400 text-xs">(opcional)</span>
                  </label>
                  <div className="relative">
                    <List className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="text"
                      name="subcategory"
                      value={form.subcategory}
                      onChange={handleChange}
                      onBlur={() => handleBlur('subcategory')}
                      placeholder="Ex: Carnes, Massas, Frutos do Mar..."
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.subcategory && !isSubcategoryValid && form.subcategory.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                    />
                  </div>
                  {touched.subcategory && !isSubcategoryValid && form.subcategory.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Subcategoria deve ter pelo menos 2 caracteres
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* DISPONÍVEL */}
                {/* ============================================================ */}
                <motion.div
                  custom={5}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                  className="flex items-center gap-3 p-4 bg-cream-50/50 rounded-xl border border-cream-200"
                >
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={form.is_available}
                    onChange={handleChange}
                    className="w-5 h-5 text-gold-500 rounded-lg border-cream-300 focus:ring-gold-400 focus:ring-offset-0 transition-colors"
                  />
                  <div>
                    <label className="text-sm font-medium text-brown-700 cursor-pointer">
                      Produto Disponível
                    </label>
                    <p className="text-xs text-brown-400">
                      {form.is_available
                        ? '✅ Produto visível no cardápio'
                        : '⛔ Produto oculto do cardápio'}
                    </p>
                  </div>
                </motion.div>

                {/* ============================================================ */}
                {/* DICA */}
                {/* ============================================================ */}
                <motion.div
                  custom={6}
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
                        Dica de cardápio
                      </p>
                      <p className="text-xs text-brown-500">
                        Descreva os ingredientes principais para atrair mais clientes.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
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
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Salvar Produto
                      </>
                    )}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  fullWidth
                  onClick={() => navigate('/admin/produtos')}
                  className="border-gold-300 text-brown-600 hover:bg-gold-50/50"
                >
                  Cancelar
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}
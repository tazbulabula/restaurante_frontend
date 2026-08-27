// src/pages/Admin/Mesas/Editar.tsx

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Table, 
  Users, 
  MapPin, 
  Tag,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Save,
  Crown,
  Coffee,
  Sun,
  Moon,
  LayoutGrid,
  Loader2,
  Edit
} from 'lucide-react'
import { Container, Card, CardContent, CardFooter, Button, Input, Spinner, showToast } from '@/components/ui'
import { mesasApi } from '@/api/mesas'
import type { Mesa } from '@/types/mesa.types'

// ============================================================
// CONFIGURAÇÕES DE TIPO
// ============================================================
const tiposMesa = [
  { value: 'padrao', label: 'Padrão', icon: <Table className="w-4 h-4" />, description: 'Mesa tradicional para refeições' },
  { value: 'vip', label: 'VIP', icon: <Crown className="w-4 h-4" />, description: 'Área premium com atendimento exclusivo' },
  { value: 'jantar', label: 'Jantar', icon: <Moon className="w-4 h-4" />, description: 'Ambiente intimista para jantares' },
  { value: 'externa', label: 'Externa', icon: <Sun className="w-4 h-4" />, description: 'Área ao ar livre' },
  { value: 'bar', label: 'Bar', icon: <Coffee className="w-4 h-4" />, description: 'Mesa no bar para drinks e petiscos' },
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

const loadingVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

export function AdminMesasEditar() {
  const { publicId } = useParams<{ publicId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [touched, setTouched] = useState({
    numero: false,
    capacidade: false,
    localizacao: false,
  })

  const [form, setForm] = useState<Partial<Mesa>>({
    numero: 0,
    capacidade: 0,
    tipo: 'padrao',
    localizacao: '',
    is_active: true,
  })

  useEffect(() => {
    setIsMounted(true)
    if (publicId) {
      carregarMesa(publicId)
    }
  }, [publicId])

  const carregarMesa = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await mesasApi.buscarPorPublicId(id)
      setForm(data)
    } catch (error) {
      console.error('Erro ao carregar mesa:', error)
      showToast.error('Erro ao carregar mesa')
      navigate('/admin/mesas')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================
  // VALIDAÇÕES
  // ============================================================
  const isNumeroValid = form.numero !== undefined && form.numero > 0
  const isCapacidadeValid = form.capacidade !== undefined && form.capacidade > 0
  const isLocalizacaoValid = !form.localizacao || form.localizacao.length >= 2

  const isFormValid = isNumeroValid && isCapacidadeValid && isLocalizacaoValid

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicId) return

    if (!isFormValid) {
      showToast.warning('Por favor, corrija os campos inválidos')
      return
    }

    setIsSaving(true)
    try {
      await mesasApi.atualizar(publicId, form)
      showToast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Mesa atualizada com sucesso! ✅</span>
        </div>
      )
      navigate('/admin/mesas')
    } catch (error: any) {
      console.error('Erro ao atualizar mesa:', error)
      showToast.error(error.response?.data?.detail || 'Erro ao atualizar mesa')
    } finally {
      setIsSaving(false)
    }
  }

  const getTipoIcon = (tipo: string) => {
    const found = tiposMesa.find(t => t.value === tipo)
    return found?.icon || <Table className="w-4 h-4" />
  }

  const getTipoDescription = (tipo: string) => {
    const found = tiposMesa.find(t => t.value === tipo)
    return found?.description || ''
  }

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          variants={loadingVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <div className="relative inline-block">
            <Spinner size="lg" color="gold" />
          </div>
          <p className="text-brown-500 mt-4">Carregando dados da mesa...</p>
        </motion.div>
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
          animate={isMounted ? "visible" : "hidden"}
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-brown-800">
                    Editar <span className="text-gold-500">Mesa</span>
                  </h1>
                  <p className="text-brown-500 text-sm">
                    Atualize as informações da mesa #{form.numero || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/mesas')}
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
                {/* NÚMERO DA MESA */}
                {/* ============================================================ */}
                <motion.div
                  custom={0}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Tag className="w-4 h-4 inline mr-2 text-gold-500" />
                    Número da Mesa *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="number"
                      name="numero"
                      value={form.numero || ''}
                      onChange={handleChange}
                      onBlur={() => handleBlur('numero')}
                      placeholder="Ex: 1, 2, 3..."
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.numero && !isNumeroValid && form.numero !== undefined && form.numero > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                  </div>
                  {touched.numero && !isNumeroValid && form.numero !== undefined && form.numero > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Número da mesa inválido
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* CAPACIDADE */}
                {/* ============================================================ */}
                <motion.div
                  custom={1}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <Users className="w-4 h-4 inline mr-2 text-gold-500" />
                    Capacidade *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="number"
                      name="capacidade"
                      value={form.capacidade || ''}
                      onChange={handleChange}
                      onBlur={() => handleBlur('capacidade')}
                      placeholder="Ex: 2, 4, 6..."
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.capacidade && !isCapacidadeValid && form.capacidade !== undefined && form.capacidade > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                      required
                    />
                  </div>
                  {touched.capacidade && !isCapacidadeValid && form.capacidade !== undefined && form.capacidade > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Capacidade inválida (mínimo 1 pessoa)
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* TIPO DE MESA */}
                {/* ============================================================ */}
                <motion.div
                  custom={2}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <LayoutGrid className="w-4 h-4 inline mr-2 text-gold-500" />
                    Tipo de Mesa
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getTipoIcon(form.tipo || 'padrao')}
                    </div>
                    <select
                      name="tipo"
                      value={form.tipo || 'padrao'}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-brown-800 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white transition-all duration-300 appearance-none"
                    >
                      {tiposMesa.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-brown-400 mt-1.5 flex items-center gap-1">
                    {getTipoIcon(form.tipo || 'padrao')}
                    <span>{getTipoDescription(form.tipo || 'padrao')}</span>
                  </p>
                </motion.div>

                {/* ============================================================ */}
                {/* LOCALIZAÇÃO */}
                {/* ============================================================ */}
                <motion.div
                  custom={3}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                >
                  <label className="block text-sm font-medium text-brown-700 mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-2 text-gold-500" />
                    Localização <span className="text-brown-400 text-xs">(opcional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brown-400" />
                    <input
                      type="text"
                      name="localizacao"
                      value={form.localizacao || ''}
                      onChange={handleChange}
                      onBlur={() => handleBlur('localizacao')}
                      placeholder="Ex: Salão Principal, Terraço, Varanda..."
                      className={`
                        w-full pl-11 pr-4 py-3 bg-cream-50/50 border rounded-xl 
                        text-brown-800 placeholder-brown-400
                        focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white
                        transition-all duration-300
                        ${touched.localizacao && !isLocalizacaoValid && form.localizacao && form.localizacao.length > 0
                          ? 'border-red-400 focus:ring-red-400/50'
                          : 'border-cream-200 hover:border-gold-300'
                        }
                      `}
                    />
                  </div>
                  {touched.localizacao && !isLocalizacaoValid && form.localizacao && form.localizacao.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Localização deve ter pelo menos 2 caracteres
                    </motion.p>
                  )}
                </motion.div>

                {/* ============================================================ */}
                {/* STATUS ATIVO */}
                {/* ============================================================ */}
                <motion.div
                  custom={4}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                  className="flex items-center gap-3 p-4 bg-cream-50/50 rounded-xl border border-cream-200"
                >
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active !== undefined ? form.is_active : true}
                    onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-5 h-5 text-gold-500 rounded-lg border-cream-300 focus:ring-gold-400 focus:ring-offset-0 transition-colors"
                  />
                  <div>
                    <label className="text-sm font-medium text-brown-700 cursor-pointer">
                      Mesa Ativa
                    </label>
                    <p className="text-xs text-brown-400">
                      {form.is_active !== undefined && form.is_active
                        ? '✅ Mesa disponível para reservas'
                        : '⛔ Mesa indisponível para reservas'}
                    </p>
                  </div>
                </motion.div>

                {/* ============================================================ */}
                {/* DICA */}
                {/* ============================================================ */}
                <motion.div
                  custom={5}
                  variants={inputVariants}
                  initial="hidden"
                  animate={isMounted ? "visible" : "hidden"}
                  className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Atualizando informações
                      </p>
                      <p className="text-xs text-blue-600">
                        As alterações serão aplicadas imediatamente no sistema.
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
                  isLoading={isSaving}
                  disabled={!isFormValid}
                  className="py-3.5 text-lg font-semibold group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Atualizar Mesa
                      </>
                    )}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  fullWidth
                  onClick={() => navigate('/admin/mesas')}
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
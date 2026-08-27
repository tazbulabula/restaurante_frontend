// src/pages/Contato/index.tsx

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { Container } from '@/components/ui'

// ============================================================
// ÍCONES SOCIAIS EM SVG
// ============================================================
const SocialIcons = {
  Instagram: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Facebook: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Twitter: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  Youtube: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
}

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

export function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsLoading(false)
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    })

    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const socialLinks = [
    { icon: <SocialIcons.Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <SocialIcons.Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <SocialIcons.Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <SocialIcons.Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' },
  ]

  const infoItems = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Telefone',
      info: '(244) 999 999 999',
      description: 'Segunda a Sábado, 12h - 23h'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      info: 'contato@gourmet.ao',
      description: 'Respondemos em até 24h'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Localização',
      info: 'Luanda, Angola',
      description: 'Bairro Talatona, Rua Principal'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Horário',
      info: '12h - 23h',
      description: 'Domingo: 12h - 22h'
    }
  ]

  return (
    <div className="min-h-screen bg-cream-50 py-16">
      <Container>
        {/* ============================================================ */}
        {/* HEADER */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span 
            variants={fadeUp}
            className="inline-block text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Entre em Contato
          </motion.span>
          <motion.h1 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-display text-brown-800"
          >
            Vamos <span className="text-gold-500">conversar</span>
          </motion.h1>
          <motion.p 
            variants={fadeUp}
            className="text-brown-600 max-w-2xl mx-auto mt-4"
          >
            Tem alguma dúvida, sugestão ou quer fazer uma reserva especial? 
            Estamos aqui para ajudar!
          </motion.p>
          <motion.div 
            variants={fadeUp}
            className="w-24 h-1 bg-gold-500 mx-auto mt-4"
          />
        </motion.div>

        {/* ============================================================ */}
        {/* CONTEÚDO PRINCIPAL */}
        {/* ============================================================ */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
          
          {/* ============================================================ */}
          {/* INFORMAÇÕES DE CONTATO */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.15, 1] }}
          >
            <h2 className="text-2xl font-display text-brown-800 mb-6">
              Informações de <span className="text-gold-500">Contato</span>
            </h2>

            <div className="space-y-4">
              {infoItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm shadow-brown-900/5 border border-cream-200/50 hover:border-gold-400/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-500 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-brown-400">{item.title}</p>
                    <p className="text-brown-800 font-medium">{item.info}</p>
                    <p className="text-sm text-brown-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Redes Sociais */}
            <div className="mt-8">
              <p className="text-sm text-brown-600 font-medium mb-3">
                Conecte-se conosco
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-gold-50 text-gold-500 hover:bg-gold-500 hover:text-white flex items-center justify-center transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Badge de confiança */}
            <div className="mt-6 p-4 bg-gold-50 rounded-xl border border-gold-200/50">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-gold-500" />
                <p className="text-sm text-brown-700">
                  <span className="font-semibold">Resposta rápida:</span> Respondemos em até 24h úteis
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* FORMULÁRIO DE CONTATO */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.15, 1], delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-brown-900/5 border border-cream-200/50">
              <h2 className="text-2xl font-display text-brown-800 mb-6">
                Envie uma <span className="text-gold-500">mensagem</span>
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-display text-brown-800 mb-2">
                    Mensagem enviada! 🎉
                  </h3>
                  <p className="text-brown-600">
                    Agradecemos seu contato. Responderemos em breve!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Nome completo *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-brown-800 placeholder-brown-400 focus:outline-none focus:border-gold-400 focus:bg-white transition-all duration-300"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-brown-800 placeholder-brown-400 focus:outline-none focus:border-gold-400 focus:bg-white transition-all duration-300"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-brown-800 placeholder-brown-400 focus:outline-none focus:border-gold-400 focus:bg-white transition-all duration-300"
                      placeholder="(244) 999 999 999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Assunto *
                    </label>
                    <select
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-brown-800 focus:outline-none focus:border-gold-400 focus:bg-white transition-all duration-300"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="reserva">Reserva de Mesa</option>
                      <option value="evento">Evento Especial</option>
                      <option value="feedback">Feedback ou Sugestão</option>
                      <option value="duvida">Dúvida Geral</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">
                      Mensagem *
                    </label>
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-lg text-brown-800 placeholder-brown-400 focus:outline-none focus:border-gold-400 focus:bg-white transition-all duration-300 resize-none"
                      placeholder="Descreva sua mensagem..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-brown-900 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Enviar Mensagem
                      </span>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
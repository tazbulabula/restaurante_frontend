// src/components/common/Layout/Footer.tsx

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  ChefHat, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Sparkles,
  Send
} from 'lucide-react'

// ============================================================
// ÍCONES SOCIAIS EM SVG (para evitar problemas de importação)
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

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: "-50px", amount: 0.1 })

  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: <SocialIcons.Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <SocialIcons.Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <SocialIcons.Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <SocialIcons.Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' },
  ]

  const links = [
    { label: 'Cardápio', href: '/cardapio' },
    { label: 'Reservas', href: '/reservas/nova' },
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
  ]

  return (
    <footer 
      ref={footerRef}
      className="relative bg-gradient-to-b from-brown-900 to-brown-950 text-cream-50 overflow-hidden"
    >
      {/* ============================================================ */}
      {/* DECORATIVE BACKGROUND */}
      {/* ============================================================ */}
      <div className="absolute inset-0 bg-luxury-pattern opacity-5" />
      
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -30, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 30, 0]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* ============================================================ */}
      {/* CONTEÚDO PRINCIPAL */}
      {/* ============================================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid md:grid-cols-4 gap-8 md:gap-12"
        >
          {/* ============================================================ */}
          {/* COLUNA 1 - LOGO E DESCRIÇÃO */}
          {/* ============================================================ */}
          <motion.div variants={fadeUp} className="md:col-span-1">
            <Link to="/" className="inline-block">
              <motion.div 
                className="flex items-center gap-2 text-2xl font-display font-bold text-gold-400"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ChefHat className="w-7 h-7 text-gold-500" />
                <span>Aurora</span>
              </motion.div>
            </Link>
            
            <motion.p 
              variants={fadeUp}
              className="text-cream-200/80 mt-4 text-sm leading-relaxed max-w-xs"
            >
              Sabores autênticos em um ambiente acolhedor e sofisticado. 
              Uma experiência gastronômica única em cada visita.
            </motion.p>

            <motion.div 
              variants={fadeUp}
              className="flex items-center gap-2 mt-4 text-cream-200/60 text-xs"
            >
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Desde 2024</span>
              <span className="w-1 h-1 bg-gold-500/30 rounded-full" />
              <span>⭐ 4.9/5</span>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={fadeUp}
              className="flex gap-3 mt-6"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ 
                    y: -3, 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-cream-50/10 border border-cream-50/15 flex items-center justify-center text-cream-300 hover:text-gold-400 hover:border-gold-400/40 hover:bg-gold-500/15 transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* ============================================================ */}
          {/* COLUNA 2 - LINKS RÁPIDOS */}
          {/* ============================================================ */}
          <motion.div variants={fadeUp}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              {links.map((link, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={link.href}
                    className="text-cream-200/80 hover:text-gold-400 transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ============================================================ */}
          {/* COLUNA 3 - HORÁRIO */}
          {/* ============================================================ */}
          <motion.div variants={fadeUp}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horário
            </h4>
            <ul className="space-y-2.5 text-sm">
              <motion.li 
                className="flex justify-between text-cream-200/80"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <span>Segunda - Sexta</span>
                <span className="text-cream-50 font-medium">12h - 23h</span>
              </motion.li>
              <motion.li 
                className="flex justify-between text-cream-200/80"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.45, duration: 0.3 }}
              >
                <span>Sábado</span>
                <span className="text-cream-50 font-medium">12h - 23h</span>
              </motion.li>
              <motion.li 
                className="flex justify-between text-cream-200/80"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <span>Domingo</span>
                <span className="text-cream-50 font-medium">12h - 22h</span>
              </motion.li>
              <motion.li 
                className="flex justify-between text-cream-200/50 text-xs pt-2 border-t border-cream-50/10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.55, duration: 0.3 }}
              >
                <span>📍 Reservas recomendadas</span>
              </motion.li>
            </ul>
          </motion.div>

          {/* ============================================================ */}
          {/* COLUNA 4 - CONTATO */}
          {/* ============================================================ */}
          <motion.div variants={fadeUp}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Contato
            </h4>
            <ul className="space-y-3 text-sm">
              <motion.li 
                className="flex items-start gap-3 text-cream-200/80 hover:text-cream-50 transition-colors duration-300"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Phone className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span>(244) 999 999 999</span>
              </motion.li>
              <motion.li 
                className="flex items-start gap-3 text-cream-200/80 hover:text-cream-50 transition-colors duration-300"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.45, duration: 0.3 }}
              >
                <Mail className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:contato@gourmet.ao" className="hover:text-gold-400 transition-colors">
                  contato@gourmet.ao
                </a>
              </motion.li>
              <motion.li 
                className="flex items-start gap-3 text-cream-200/80 hover:text-cream-50 transition-colors duration-300"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <span>Luanda, Angola</span>
              </motion.li>
            </ul>

            {/* Newsletter */}
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <p className="text-xs text-cream-200/60 mb-2">
                📬 Receba novidades e ofertas
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Seu email"
                  className="flex-1 px-3 py-2 bg-cream-50/10 border border-cream-50/15 rounded-lg text-sm text-cream-50 placeholder-cream-200/40 focus:outline-none focus:border-gold-400/50 focus:bg-cream-50/20 transition-all duration-300"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-brown-900 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  OK
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* BOTTOM BAR - CORRIGIDO COM MAIOR CONTRASTE */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 pt-6 border-t border-cream-50/20 flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
        >
          {/* Copyright - Mais claro e legível */}
          <p className="text-cream-200/90 font-medium">
            © {currentYear} <span className="text-gold-400 font-bold">Aurora</span>. 
            Todos os direitos reservados.
          </p>
          
          {/* Links - Mais visíveis */}
          <div className="flex items-center gap-4 text-xs">
            <Link 
              to="/politica-privacidade" 
              className="text-cream-200/80 hover:text-gold-400 transition-colors duration-300 font-medium"
            >
              Política de Privacidade
            </Link>
            <span className="w-px h-4 bg-cream-50/20" />
            <Link 
              to="/termos" 
              className="text-cream-200/80 hover:text-gold-400 transition-colors duration-300 font-medium"
            >
              Termos de Uso
            </Link>
          </div>

          {/* Feito com amor - Mais visível */}
          <motion.p 
            className="text-xs flex items-center gap-1.5 text-cream-200/80 font-medium"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Feito com 
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> 
            em Angola
          </motion.p>
        </motion.div>
      </div>
    </footer>
  )
}
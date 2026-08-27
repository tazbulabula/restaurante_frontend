// src/pages/Sobre/index.tsx

import { motion } from 'framer-motion'
import { 
  ChefHat, 
  Utensils, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Sparkles,
  Heart,
  Star
} from 'lucide-react'
import { Container } from '@/components/ui'

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

export function Sobre() {
  const valores = [
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: 'Culinária de Excelência',
      description: 'Nossos chefs transformam ingredientes frescos em experiências gastronômicas inesquecíveis.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Paixão pela Gastronomia',
      description: 'Cada prato é preparado com dedicação e amor, respeitando técnicas tradicionais e inovadoras.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Atendimento Personalizado',
      description: 'Nossa equipe está sempre pronta para proporcionar uma experiência única e acolhedora.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Qualidade e Sofisticação',
      description: 'Trabalhamos com os melhores ingredientes para garantir sabor e excelência em cada detalhe.'
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
            Sobre Nós
          </motion.span>
          <motion.h1 
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-display text-brown-800"
          >
            Uma história de <span className="text-gold-500">paixão</span> e <span className="text-gold-500">sabor</span>
          </motion.h1>
          <motion.div 
            variants={fadeUp}
            className="w-24 h-1 bg-gold-500 mx-auto mt-4"
          />
        </motion.div>

        {/* ============================================================ */}
        {/* CONTEÚDO PRINCIPAL */}
        {/* ============================================================ */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Imagem */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.15, 1] }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-brown-900/10">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
                alt="Restaurante Aurora"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gold-500 text-brown-900 p-4 rounded-xl shadow-lg shadow-gold-500/30">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-brown-900" />
                <span className="font-bold text-lg">4.9</span>
                <span className="text-sm opacity-80">(150+ avaliações)</span>
              </div>
            </div>
          </motion.div>

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.15, 1], delay: 0.2 }}
          >
            <h2 className="text-3xl font-display text-brown-800 mb-4">
              Bem-vindo ao <span className="text-gold-500">Aurora</span>
            </h2>
            <p className="text-brown-600 leading-relaxed mb-4">
              O Restaurante Aurora nasceu do desejo de criar um espaço onde a gastronomia se encontra com a sofisticação e o acolhimento. Desde 2024, oferecemos uma experiência única que combina sabores autênticos, ingredientes frescos e um ambiente cuidadosamente pensado para cada detalhe.
            </p>
            <p className="text-brown-600 leading-relaxed mb-6">
              Nossa missão é proporcionar momentos inesquecíveis através da culinária, valorizando a tradição e inovando com criatividade. Cada prato é uma obra de arte, preparada com paixão e ingredientes selecionados de fornecedores locais.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-brown-700">
                <Clock className="w-5 h-5 text-gold-500" />
                <span>Desde 2024</span>
              </div>
              <div className="flex items-center gap-2 text-brown-700">
                <Utensils className="w-5 h-5 text-gold-500" />
                <span>50+ pratos especiais</span>
              </div>
              <div className="flex items-center gap-2 text-brown-700">
                <Users className="w-5 h-5 text-gold-500" />
                <span>10k+ clientes felizes</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* VALORES */}
        {/* ============================================================ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h2 
            variants={fadeUp}
            className="text-3xl font-display text-center text-brown-800 mb-12"
          >
            Nossos <span className="text-gold-500">Valores</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg shadow-brown-900/5 border border-cream-200/50 hover:border-gold-400/30 transition-all duration-300"
              >
                <div className="text-gold-500 mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-display text-brown-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-brown-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* INFORMAÇÕES ADICIONAIS */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.15, 1] }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-brown-900 to-brown-950 rounded-2xl p-8 md:p-12 text-cream-50"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-gold-400 font-semibold uppercase tracking-wider text-sm mb-3">
                📍 Localização
              </h4>
              <p className="text-cream-200/80">
                Luanda, Angola<br />
                <span className="text-sm text-cream-200/60">
                  Bairro Talatona, Rua Principal
                </span>
              </p>
            </div>
            <div>
              <h4 className="text-gold-400 font-semibold uppercase tracking-wider text-sm mb-3">
                🕐 Horário
              </h4>
              <p className="text-cream-200/80">
                Seg - Sáb: 12h - 23h<br />
                <span className="text-sm text-cream-200/60">
                  Dom: 12h - 22h
                </span>
              </p>
            </div>
            <div>
              <h4 className="text-gold-400 font-semibold uppercase tracking-wider text-sm mb-3">
                📞 Contato
              </h4>
              <p className="text-cream-200/80">
                (244) 921 351 606<br />
                <a href="mailto:contato@gourmet.ao" className="text-sm text-cream-200/60 hover:text-gold-400 transition-colors">
                  contato@Aurora.ao
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
// src/pages/Home/index.tsx

import { Link } from 'react-router-dom'
import { Button, Container, Card } from '@/components/ui'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { 
  ChefHat, 
  Leaf, 
  Star, 
  Clock, 
  Users, 
  Award,
  ArrowRight,
  Utensils,
  Coffee,
  Sparkles
} from 'lucide-react'

// ============================================================
// ANIMAÇÕES CONFIGURÁVEIS - MAIS FLUIDAS
// ============================================================

// Entrada suave com duração maior
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.15, 1] // Curva mais suave
    }
  }
}

// Scale-in mais lento
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.15, 1],
      delay: 0.1
    }
  }
}

// Stagger com intervalos maiores
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
      duration: 0.5
    }
  }
}

// Animação de blur para entrada
const blurIn = {
  hidden: { opacity: 0, filter: 'blur(12px)', scale: 0.98 },
  visible: { 
    opacity: 1, 
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

// Animação de slide lateral
const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.1, 0.15, 1]
    }
  }
}

export function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const diferenciaisRef = useRef<HTMLDivElement>(null)
  const depoimentosRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  // Observers para cada seção
  const isStatsInView = useInView(statsRef, { once: true, margin: "-120px", amount: 0.2 })
  const isDiferenciaisInView = useInView(diferenciaisRef, { once: true, margin: "-100px", amount: 0.15 })
  const isDepoimentosInView = useInView(depoimentosRef, { once: true, margin: "-100px", amount: 0.15 })
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-80px", amount: 0.2 })
  
  const { scrollYProgress } = useScroll()
  
  // Parallax mais suave
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.5])
  
  // Parallax para elementos do hero
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -40])
  const badgeY = useTransform(scrollYProgress, [0, 0.2], [0, -20])

  useEffect(() => {
    // Delay inicial para criar expectativa
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* HERO SECTION - COM BLUR-IN */}
      {/* ============================================================ */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brown-900 via-brown-800 to-gold-700/90"
        style={{ 
          y: heroY, 
          scale: heroScale, 
          opacity: heroOpacity 
        }}
      >
        {/* Imagem de fundo com parallax suave */}
        <motion.div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')] bg-cover bg-center"
          style={{ 
            scale: useTransform(scrollYProgress, [0, 1], [1, 1.15]),
            opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0.3])
          }}
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-luxury-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/40 to-transparent" />

        {/* Orbes decorativas com movimento mais suave */}
        <motion.div 
          className="absolute rounded-full blur-3xl bg-gold-500/20 w-64 h-64 top-1/4 left-1/4"
          animate={{ 
            scale: [1, 1.2, 1], 
            x: [0, 40, 0], 
            y: [0, -20, 0] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute rounded-full blur-3xl bg-amber-500/15 w-96 h-96 bottom-1/3 right-1/4"
          animate={{ 
            scale: [1, 1.3, 1], 
            x: [0, -30, 0], 
            y: [0, 30, 0] 
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 1 
          }}
        />

        {/* Conteúdo com blur-in */}
        <Container className="relative z-10 text-center text-cream-50 px-4">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {/* Badge com entrada suave */}
            <motion.div 
              variants={fadeUp}
              style={{ y: badgeY }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 backdrop-blur-sm border border-gold-400/30 rounded-full text-gold-300 text-sm font-medium"
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Experiência Gastronômica Premium</span>
              <span className="w-1 h-1 bg-gold-400 rounded-full" />
              <span>Desde 2024</span>
            </motion.div>

            {/* Título com entrada lenta */}
            <motion.h1 
              variants={blurIn}
              style={{ y: titleY }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight"
            >
              <span className="text-cream-50">Restaurante</span>
              <br />
              <motion.span 
                className="text-gold-400 inline-block relative"
                whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                Aurora
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                />
              </motion.span>
            </motion.h1>

            {/* Subtítulo com fade suave */}
            <motion.p 
              variants={fadeUp} 
              className="text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto font-light text-cream-100/90"
              transition={{ delay: 0.3 }}
            >
              Sabores autênticos em um ambiente acolhedor e sofisticado.
            </motion.p>

            {/* Botões com entrada escalonada */}
            <motion.div 
              variants={staggerContainer}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-4"
            >
              <motion.div variants={scaleIn}>
                <Link to="/cardapio">
                  <motion.div 
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="gold" 
                      size="lg" 
                      className="bg-gold-500 hover:bg-gold-400 text-brown-900 font-semibold transition-all duration-500 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Ver Cardápio
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <motion.span 
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Link to="/reservas/nova">
                  <motion.div 
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-gold-500 text-cream-50 hover:bg-gold-500/10 transition-all duration-500 group"
                    >
                      <span className="flex items-center gap-2">
                        Reservar Mesa
                        <Utensils className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator com animação contínua */}
            <motion.div 
              variants={fadeUp}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-200/60 text-sm"
              animate={{ 
                y: [0, 10, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <span className="uppercase tracking-widest text-xs">Scroll</span>
              <div className="w-px h-10 bg-gradient-to-b from-cream-200/60 to-transparent" />
            </motion.div>
          </motion.div>
        </Container>
      </motion.section>

      {/* ============================================================ */}
      {/* STATS - COM ANIMAÇÃO SOB DEMANDA */}
      {/* ============================================================ */}
      <motion.section 
        ref={statsRef}
        className="relative py-16 bg-brown-900/95 border-y border-gold-500/20"
        initial={{ opacity: 0, y: 50 }}
        animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ 
          duration: 1, 
          ease: [0.25, 0.1, 0.15, 1],
          delay: 0.2
        }}
      >
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Users className="w-8 h-8" />, value: "10k+", label: "Clientes Felizes" },
              { icon: <Award className="w-8 h-8" />, value: "150+", label: "Prêmios Recebidos" },
              { icon: <Clock className="w-8 h-8" />, value: "8 anos", label: "de Experiência" },
              { icon: <Coffee className="w-8 h-8" />, value: "50+", label: "Pratos Especiais" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  delay: 0.3 + index * 0.15, 
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.15, 1]
                }}
                className="group"
              >
                <motion.div 
                  className="text-gold-400 mb-3 flex justify-center"
                  whileHover={{ 
                    rotate: 12, 
                    scale: 1.15,
                    transition: { duration: 0.3 }
                  }}
                >
                  {stat.icon}
                </motion.div>
                <motion.p 
                  className="text-3xl md:text-4xl font-display font-bold text-cream-50"
                  initial={{ scale: 0.6 }}
                  animate={isStatsInView ? { scale: 1 } : {}}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200,
                    damping: 20,
                    delay: 0.4 + index * 0.15
                  }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-cream-200/70 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.section>

      {/* ============================================================ */}
      {/* DIFERENCIAIS - COM ANIMAÇÃO SOB DEMANDA */}
      {/* ============================================================ */}
      <section ref={diferenciaisRef} className="py-20 bg-cream-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isDiferenciaisInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 0.9, 
              ease: [0.25, 0.1, 0.15, 1],
              delay: 0.2
            }}
            className="text-center mb-16"
          >
            <span className="inline-block text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Nossos Diferenciais
            </span>
            <h2 className="text-3xl md:text-5xl font-display">
              Por que nos <span className="text-gold-500">escolher</span>?
            </h2>
            <motion.div 
              className="w-20 h-1 bg-gold-500 mx-auto mt-4"
              initial={{ width: 0 }}
              animate={isDiferenciaisInView ? { width: 80 } : {}}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate={isDiferenciaisInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.25,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {[
              { 
                icon: <ChefHat className="w-12 h-12" />,
                title: 'Chefs Experientes',
                desc: 'Profissionais apaixonados pela culinária que transformam cada prato em uma obra de arte.',
              },
              { 
                icon: <Leaf className="w-12 h-12" />,
                title: 'Ingredientes Frescos',
                desc: 'Produtos selecionados diariamente de fornecedores locais, garantindo qualidade e sabor.',
              },
              { 
                icon: <Star className="w-12 h-12" />,
                title: 'Atendimento Premium',
                desc: 'Uma experiência única em cada visita, com serviços personalizados que encantam.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                className="group"
              >
                <Card 
                  variant="hover" 
                  className="text-center p-8 h-full relative overflow-hidden border-2 border-transparent hover:border-gold-400/40 rounded-2xl transition-all duration-500"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gold-500/5 rounded-2xl"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className="text-gold-600 mb-4 flex justify-center"
                      whileHover={{ 
                        rotate: 15, 
                        scale: 1.15,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-xl font-display text-brown-800 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-brown-600">{item.desc}</p>
                    <motion.div 
                      className="w-12 h-0.5 bg-gold-500 mx-auto mt-4"
                      initial={{ width: 0 }}
                      whileHover={{ width: 48 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/* DEPOIMENTOS - COM ANIMAÇÃO SOB DEMANDA */}
      {/* ============================================================ */}
      <section ref={depoimentosRef} className="py-20 bg-brown-900/95">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isDepoimentosInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 0.9, 
              ease: [0.25, 0.1, 0.15, 1],
              delay: 0.2
            }}
            className="text-center mb-16"
          >
            <span className="inline-block text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Depoimentos
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-cream-50">
              O que nossos <span className="text-gold-400">clientes</span> dizem
            </h2>
            <motion.div 
              className="w-20 h-1 bg-gold-500 mx-auto mt-4"
              initial={{ width: 0 }}
              animate={isDepoimentosInView ? { width: 80 } : {}}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ana Silva",
                text: "Experiência incrível! O atendimento é impecável e a comida é divina. Voltarei sempre!",
                rating: 5,
                role: "Cliente Frequente"
              },
              {
                name: "Carlos Mendes",
                text: "Melhor restaurante da cidade. Ambiente sofisticado e pratos que surpreendem a cada visita.",
                rating: 5,
                role: "Cliente Frequente"
              },
              {
                name: "Mariana Costa",
                text: "Recomendo a todos! O Restaurante Aurora superou todas as minhas expectativas. Nota 10!",
                rating: 5,
                role: "Cliente Frequente"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isDepoimentosInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  delay: 0.4 + i * 0.2, 
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.15, 1]
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="bg-cream-50/5 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/10 hover:border-gold-400/30 transition-all duration-500"
              >
                <motion.div 
                  className="flex text-gold-400 mb-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isDepoimentosInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.2, duration: 0.5 }}
                >
                  {'★'.repeat(testimonial.rating)}
                </motion.div>
                <p className="text-cream-100 text-lg leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="mt-6 pt-4 border-t border-cream-50/10">
                  <p className="text-cream-50 font-medium">{testimonial.name}</p>
                  <p className="text-cream-200/60 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/* CTA FINAL - COM ANIMAÇÃO SOB DEMANDA */}
      {/* ============================================================ */}
      <section ref={ctaRef} className="relative py-20 overflow-hidden bg-gradient-to-br from-gold-600 via-gold-500 to-gold-700">
        <motion.div 
          className="absolute inset-0 bg-luxury-pattern opacity-10"
          animate={{ 
            scale: [1, 1.04, 1], 
            rotate: [0, 1, 0] 
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute rounded-full blur-3xl bg-white/10 w-64 h-64 top-0 left-0"
          animate={{ 
            x: [0, 80, 0], 
            y: [0, -40, 0] 
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute rounded-full blur-3xl bg-brown-900/20 w-96 h-96 bottom-0 right-0"
          animate={{ 
            x: [0, -60, 0], 
            y: [0, 40, 0] 
          }}
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        <Container className="relative z-10 text-center text-cream-50">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 1, 
              ease: [0.25, 0.1, 0.15, 1],
              delay: 0.2
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.06, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="inline-block mb-6"
            >
              <span className="text-6xl">🍽️</span>
            </motion.div>

            <motion.h2 
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Pronto para uma <span className="text-cream-200">experiência única</span>?
            </motion.h2>

            <motion.p 
              className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isCtaInView ? { opacity: 0.9 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Reserve sua mesa agora e venha descobrir o que faz do Restaurante Aurora o lugar preferido dos amantes da boa gastronomia.
            </motion.p>
            
            <motion.div 
              whileHover={{ scale: 1.06, transition: { duration: 0.3 } }} 
              whileTap={{ scale: 0.95 }}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link to="/reservas/nova">
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="bg-cream-50 text-gold-700 hover:bg-cream-100 text-lg px-10 py-4 shadow-2xl shadow-gold-500/30 transition-all duration-500 group"
                >
                  <span className="flex items-center gap-3">
                    Reservar Mesa
                    <motion.span
                      animate={{ x: [0, 6, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                </Button>
              </Link>
            </motion.div>

            <motion.p 
              className="text-cream-200/60 text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={isCtaInView ? { opacity: 0.6 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <span className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Mais de 10.000 clientes já confiaram em nós
              </span>
            </motion.p>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
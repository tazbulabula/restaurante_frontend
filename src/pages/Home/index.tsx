// src/pages/Home/index.tsx

import { Link } from 'react-router-dom'
import { Button, Container, Card } from '@/components/ui'

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-brown-900 via-brown-800 to-gold-700">
        <div className="absolute inset-0 bg-luxury-pattern opacity-30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')] bg-cover bg-center opacity-20" />
        
        <Container className="relative z-10 text-center text-cream-50">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className='text-brown-300'>Restaurante</span> <span className="text-gold-400">Aurora</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
            Sabores autênticos em um ambiente acolhedor e sofisticado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cardapio">
              <Button variant="gold" size="lg">
                Ver Cardápio
              </Button>
            </Link>
            <Link to="/reservas/nova">
              <Button variant="outline-gold" size="lg">
                Reservar Mesa
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Sobre / Diferenciais */}
      <section className="py-16 bg-cream-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display text-center text-brown-800 mb-12">
            Por que nos escolher?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: '👨‍🍳', 
                title: 'Chefs Experientes', 
                desc: 'Profissionais apaixonados pela culinária' 
              },
              { 
                icon: '🌿', 
                title: 'Ingredientes Frescos', 
                desc: 'Produtos selecionados diariamente' 
              },
              { 
                icon: '⭐', 
                title: 'Atendimento Premium', 
                desc: 'Experiência única em cada visita' 
              },
            ].map((item, i) => (
              <Card key={i} variant="hover" className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-display text-brown-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-brown-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gold-600 text-cream-50 text-center">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display mb-4">
            Pronto para uma experiência única?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Reserve sua mesa agora e venha nos conhecer!
          </p>
          <Link to="/reservas/nova">
            <Button variant="gold" size="lg" className="bg-cream-50 text-gold-700 hover:bg-cream-100">
              Reservar Mesa
            </Button>
          </Link>
        </Container>
      </section>
    </div>
  )
}
// src/components/common/Breadcrumbs.tsx

import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'

const routeNames: Record<string, string> = {
  '/': 'Início',
  '/cardapio': 'Cardápio',
  '/carrinho': 'Carrinho',
  '/checkout': 'Checkout',
  '/pagamento': 'Pagamento',
  '/pedidos/meus': 'Meus Pedidos',
  '/reservas/nova': 'Nova Reserva',
  '/reservas/minhas': 'Minhas Reservas',
  '/admin': 'Admin',
  '/admin/produtos': 'Produtos',
  '/admin/mesas': 'Mesas',
  '/admin/pedidos': 'Pedidos',
  '/admin/reservas': 'Reservas',
}

export function Breadcrumbs() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  if (pathSegments.length === 0) return null

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const name = routeNames[path] || segment.charAt(0).toUpperCase() + segment.slice(1)
    const isLast = index === pathSegments.length - 1

    return { name, path, isLast }
  })

  return (
    <nav className="text-sm text-brown-500 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/" className="hover:text-gold-600 transition">
            Início
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            <span className="text-brown-300">/</span>
            {item.isLast ? (
              <span className="text-brown-800 font-medium">{item.name}</span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-gold-600 transition"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
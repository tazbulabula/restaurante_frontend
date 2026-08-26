// src/routes/index.tsx

import { ChangePassword } from '@/pages/Auth/ChangePassword'
import { ForgotPassword } from '@/pages/Auth/ForgotPassword'

import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { Layout } from '@/components/common/Layout/Layout'
import { AdminLayout } from '@/components/common/Layout/AdminLayout'

// Páginas Públicas
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Auth/Login'
import { Register } from '@/pages/Auth/Register'
import { Cardapio } from '@/pages/Cardapio'
import { DetalheProduto } from '@/pages/Produto/Detalhe'

// Páginas Privadas (Clientes)
import { Carrinho } from '@/pages/Pedidos/Carrinho'
import { Checkout } from '@/pages/Pedidos/Checkout'
import { MeusPedidos } from '@/pages/Pedidos/MeusPedidos'
import { NovaReserva } from '@/pages/Reservas/NovaReserva'
import { MinhasReservas } from '@/pages/Reservas/MinhasReservas'
import { Pagamento } from '@/pages/Pagamento'

// Páginas Admin
import { AdminDashboard } from '@/pages/Admin/Dashboard'
import { AdminProdutos } from '@/pages/Admin/Produtos/Lista'
import { AdminProdutosCriar } from '@/pages/Admin/Produtos/Criar'
import { AdminProdutosEditar } from '@/pages/Admin/Produtos/Editar'
import { AdminMesas } from '@/pages/Admin/Mesas/Lista'
import { AdminMesasCriar } from '@/pages/Admin/Mesas/Criar'
import { AdminMesasEditar } from '@/pages/Admin/Mesas/Editar'
import { AdminPedidos } from '@/pages/Admin/Pedidos/Lista'
import { AdminReservas } from '@/pages/Admin/Reservas/Lista'
import { AdminClientes } from '@/pages/Admin/Clientes/Lista'
import { AdminClientesCriar } from '@/pages/Admin/Clientes/Criar'
import { AdminClientesEditar } from '@/pages/Admin/Clientes/Editar'

import { ScrollToTop } from '@/components/common/ScrollToTop'

export const router = createBrowserRouter([
  // ============================================================
  // ROTAS PÚBLICAS (Layout normal)
  // ============================================================
  {
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/cardapio', element: <Cardapio /> },
      { path: '/login', element: <Login /> },
      { path: '/registrar', element: <Register /> },
      { path: '/produto/:publicId', element: <DetalheProduto /> },
      {
        path: '/esqueci-senha',
        element: <ForgotPassword />,
      },
    ],
  },

  // ============================================================
  // ROTAS PRIVADAS - CLIENTES (Layout normal)
  // ============================================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <>
            <ScrollToTop />
            <Layout />
          </>
        ),
        children: [
          { path: '/carrinho', element: <Carrinho /> },
          { path: '/checkout', element: <Checkout /> },
          { path: '/pedidos/meus', element: <MeusPedidos /> },
          { path: '/reservas/nova', element: <NovaReserva /> },
          { path: '/reservas/minhas', element: <MinhasReservas /> },
          { path: '/pagamento', element: <Pagamento /> },
          {
            path: '/alterar-senha',
            element: <ChangePassword />,
          },
        ],
      },
    ],
  },

  // ============================================================
  // ROTAS ADMIN (AdminLayout com Sidebar)
  // ============================================================
  {
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        element: (
          <>
            <ScrollToTop />
            <AdminLayout />
          </>
        ),
        children: [
          // Dashboard
          { path: '/admin', element: <AdminDashboard /> },
          
          // Produtos
          { path: '/admin/produtos', element: <AdminProdutos /> },
          { path: '/admin/produtos/criar', element: <AdminProdutosCriar /> },
          { path: '/admin/produtos/editar/:publicId', element: <AdminProdutosEditar /> },
          
          // Mesas
          { path: '/admin/mesas', element: <AdminMesas /> },
          { path: '/admin/mesas/criar', element: <AdminMesasCriar /> },
          { path: '/admin/mesas/editar/:publicId', element: <AdminMesasEditar /> },
          
          // Pedidos
          { path: '/admin/pedidos', element: <AdminPedidos /> },
          
          // Reservas
          { path: '/admin/reservas', element: <AdminReservas /> },
          
          // Clientes
          { path: '/admin/clientes', element: <AdminClientes /> },
          { path: '/admin/clientes/criar', element: <AdminClientesCriar /> },
          { path: '/admin/clientes/editar/:publicId', element: <AdminClientesEditar /> },
        ],
      },
    ],
  },

  // ============================================================
  // 404
  // ============================================================
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <p className="text-xl text-gray-500 mt-4">Página não encontrada</p>
          <a href="/" className="text-gold-600 hover:underline mt-4 inline-block">
            Voltar para o início
          </a>
        </div>
      </div>
    ),
  },
])
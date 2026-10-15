// src/components/charts/PedidosPorDia.tsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { ShoppingBag } from 'lucide-react'
import { ChartCard, CustomTooltip, EmptyChart } from './index'
import type { PedidosPorDia } from '@/api/dashboard'

interface Props {
  data: PedidosPorDia[]
}

export function PedidosPorDia({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Pedidos por Dia"
        subtitle="Volume de pedidos"
        icon={<ShoppingBag className="w-4 h-4" />}
      >
        <EmptyChart />
      </ChartCard>
    )
  }

  const max = Math.max(...data.map((d) => d.total))
  const totalPedidos = data.reduce((acc, d) => acc + d.total, 0)

  return (
    <ChartCard
      title="Pedidos por Dia"
      subtitle={`${totalPedidos} pedidos nos últimos ${data.length} dias`}
      icon={<ShoppingBag className="w-4 h-4" />}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E8DCC8"
            vertical={false}
          />
          <XAxis
            dataKey="data"
            stroke="#8B7355"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#8B7355"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(212, 167, 58, 0.08)' }}
            content={
              <CustomTooltip
                formatter={(v) => `${v} pedido${v !== 1 ? 's' : ''}`}
              />
            }
          />
          <Bar dataKey="total" name="Pedidos" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.total === max
                    ? '#D4A73A'
                    : entry.total === 0
                    ? '#E8DCC8'
                    : '#5C3A21'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
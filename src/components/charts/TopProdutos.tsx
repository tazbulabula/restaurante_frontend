// src/components/charts/TopProdutos.tsx

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
import { Crown } from 'lucide-react'
import { ChartCard, CustomTooltip, EmptyChart } from './index'
import type { TopProdutoAPI } from '@/api/dashboard'

interface Props {
  data: TopProdutoAPI[]
}

export function TopProdutos({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Top 5 Produtos"
        subtitle="Mais vendidos"
        icon={<Crown className="w-4 h-4" />}
      >
        <EmptyChart />
      </ChartCard>
    )
  }

  const truncate = (str: string, n = 18) =>
    str.length > n ? str.slice(0, n) + '…' : str

  return (
    <ChartCard
      title="Top 5 Produtos"
      subtitle="Mais vendidos no período"
      icon={<Crown className="w-4 h-4" />}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E8DCC8"
            horizontal={false}
          />
          <XAxis
            type="number"
            stroke="#8B7355"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="nome"
            stroke="#5C3A21"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={100}
            tickFormatter={truncate}
          />
          <Tooltip
            cursor={{ fill: 'rgba(212, 167, 58, 0.08)' }}
            content={
              <CustomTooltip
                formatter={(v) => `${v} unidade${v !== 1 ? 's' : ''}`}
              />
            }
          />
          <Bar dataKey="total" name="Unidades" radius={[0, 8, 8, 0]}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={index === 0 ? '#D4A73A' : '#5C3A21'}
                opacity={1 - index * 0.12}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
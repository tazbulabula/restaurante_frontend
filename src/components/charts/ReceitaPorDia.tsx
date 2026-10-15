// src/components/charts/ReceitaPorDia.tsx

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { ChartCard, CustomTooltip, EmptyChart } from './index'
import type { ReceitaPorDia } from '@/api/dashboard'

interface Props {
  data: ReceitaPorDia[]
}

export function ReceitaPorDia({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Receita dos Últimos 7 Dias"
        subtitle="Faturamento diário"
        icon={<TrendingUp className="w-4 h-4" />}
      >
        <EmptyChart />
      </ChartCard>
    )
  }

  const totalReceita = data.reduce((acc, d) => acc + d.total, 0)

  return (
    <ChartCard
      title="Receita dos Últimos 7 Dias"
      subtitle={`Total: ${totalReceita.toLocaleString('pt-AO')} Kz`}
      icon={<TrendingUp className="w-4 h-4" />}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A73A" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#D4A73A" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
          />
          <Tooltip
            content={
              <CustomTooltip
                formatter={(v) => `${v.toLocaleString('pt-AO')} Kz`}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Receita"
            stroke="#D4A73A"
            strokeWidth={3}
            fill="url(#gradReceita)"
            dot={{ r: 4, fill: '#D4A73A', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#D4A73A', stroke: '#fff', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
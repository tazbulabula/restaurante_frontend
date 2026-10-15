// src/components/charts/ProdutosPorCategoria.tsx

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { Package } from 'lucide-react'
import { ChartCard, CustomTooltip, EmptyChart } from './index'
import type { ProdutoPorCategoria } from '@/api/dashboard'

const CORES = [
  '#D4A73A', // gold
  '#5C3A21', // brown
  '#10B981', // emerald
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#F43F5E', // rose
  '#F59E0B', // amber
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#EC4899', // pink
]

interface Props {
  data: ProdutoPorCategoria[]
}

export function ProdutosPorCategoria({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title="Produtos por Categoria"
        subtitle="Distribuição do cardápio"
        icon={<Package className="w-4 h-4" />}
      >
        <EmptyChart />
      </ChartCard>
    )
  }

  const total = data.reduce((acc, d) => acc + d.total, 0)

  return (
    <ChartCard
      title="Produtos por Categoria"
      subtitle={`${total} produtos no total`}
      icon={<Package className="w-4 h-4" />}
    >
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CORES[index % CORES.length]} />
            ))}
          </Pie>
          <Tooltip
            content={
              <CustomTooltip
                formatter={(v) => `${v} produto${v !== 1 ? 's' : ''}`}
              />
            }
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
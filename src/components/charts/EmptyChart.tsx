// src/components/charts/EmptyChart.tsx

import { BarChart3 } from 'lucide-react'

interface EmptyChartProps {
  message?: string
  height?: number
}

export function EmptyChart({
  message = 'Sem dados suficientes para exibir o gráfico',
  height = 260,
}: EmptyChartProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-brown-300"
      style={{ height }}
    >
      <BarChart3 className="w-10 h-10 mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
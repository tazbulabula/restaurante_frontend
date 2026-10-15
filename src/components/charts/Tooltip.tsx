// src/components/charts/Tooltip.tsx

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color?: string; payload?: any }>
  label?: string
  formatter?: (value: number, name: string) => string
}

export function CustomTooltip({
  active,
  payload,
  label,
  formatter,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-brown-900/95 backdrop-blur-sm text-cream-50 text-xs rounded-xl px-3 py-2 shadow-2xl border border-brown-700/50 min-w-[120px]">
      {label && (
        <p className="font-semibold text-gold-300 mb-1 text-[11px] uppercase tracking-wider">
          {label}
        </p>
      )}
      <div className="space-y-0.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              {entry.color && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
              )}
              <span className="text-cream-200">{entry.name}</span>
            </span>
            <span className="font-bold text-cream-50">
              {formatter
                ? formatter(entry.value, entry.name)
                : entry.value.toLocaleString('pt-AO')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
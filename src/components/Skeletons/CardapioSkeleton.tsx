// src/components/Skeletons/CardapioSkeleton.tsx

import { Skeleton } from '@/components/ui'
import { Container } from '@/components/ui'

export function CardapioSkeleton() {
  return (
    <Container className="py-12">
      {/* Título */}
      <Skeleton className="h-10 w-48 mb-8" />

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
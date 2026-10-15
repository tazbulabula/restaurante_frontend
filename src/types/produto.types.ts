// src/types/produto.types.ts

export interface Produto {
  id: number
  public_id: string
  name: string
  description?: string
  price: number
  category: string
  subcategory?: string
  is_available: boolean
  image_url?: string | null
  created_at: string
  updated_at: string
}

/** Payload para criar/atualizar produto (sem imagem — vai em multipart) */
export interface ProdutoFormData {
  name: string
  description?: string
  price: number
  category: string
  subcategory?: string
  is_available?: boolean
}

export type ProdutoUpdateData = Partial<ProdutoFormData>
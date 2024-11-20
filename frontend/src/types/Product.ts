export type Product = {
  id: number
  name: string
  price: number
  unit_id: number
  pos_product_category_id: number

  unit?: {
    id: number
    name: string
  }
}

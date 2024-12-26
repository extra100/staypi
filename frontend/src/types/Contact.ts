export type Contact = {
  id: number
  name: string
  group_id: number
  phone: string
  address: string
  outlet_name: string
  group?: {
    id: number
    name: string
  }
}

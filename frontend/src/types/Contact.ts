export type Contact = {
  id: number
  name: string
  group_id: number
  phone: string
  address: string
  group?: {
    id: number
    name: string
  }
}

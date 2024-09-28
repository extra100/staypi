export type Contact = {
  id: number
  name: string
  group_id: number

  group?: {
    id: number
    name: string
  }
}

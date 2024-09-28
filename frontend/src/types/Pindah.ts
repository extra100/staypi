export type WarehouseTransfer = {
  from_warehouse_id: number
  to_warehouse_id: number
  from_warehouse_name: string
  to_warehouse_name: string
  ref_number: string
  memo: string
  items: TransferItem[]
  attachment: any[]
  trans_date: string
}

export type TransferItem = {
  product_id: number
  product_name: number
  qty: number
}

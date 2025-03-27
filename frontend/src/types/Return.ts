export type Return = {
  trans_date: string
  id: number
  due_date: string
  jalur: string
  contact_id: number

  sales_id: number | null
  status_id: number
  createdAt: string

  term_id: number
  due: number
  ref_number: string
  ref_transaksi: string
  memo: string
  amount: number
  amount_after_tax: number
  down_payment: number
  reason_id: string

  attachment: any[]
  items: {
    finance_account_id: number
    tax_id: number | null
    desc: string
    name: string
    qty: number
    qty_update: number
    price: number
    amount: number
    price_after_tax: number
    amount_after_tax: number
    down_payment: number
    tax_manual: number
    discount_percent: number
    discount_amount: number
    unit_id: number
  }[]

  contacts: {
    id: number
    name: string
  }[]
  warehouses: {
    warehouse_id: number
    name: string
  }[]
  witholdings: {
    witholding_account_id: number
    name: string
    witholding_amount: number
    witholding_percent: number
  }[]
  warehouse_id: number
  additional_discount_percent: number
  additional_discount_amount: number
  message: string

  tages: {
    id: number
    name: string
  }[]
  witholding_percent: number
  witholding_amount: number
  witholding_account_id: number
}

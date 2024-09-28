export type Transaction = {
  trans_date: string
  due_date: string
  contact_id: number

  sales_id: number | null
  status_id: number

  term_id: number
  due: number
  ref_number: string
  memo: string
  amount: number
  amount_after_tax: number
  down_payment: number

  attachment: any[]
  items: {
    finance_account_id: number
    tax_id: number | null
    desc: string
    name: string
    qty: number
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

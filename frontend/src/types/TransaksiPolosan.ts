export interface Contact {
  id: number
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  address: string
  country_id: number
  province_id?: number | null
  city_id?: number | null
  district_id?: number | null
  village_id?: number | null
  group_id: number
  salutation_id?: number | null
  type_ids: number[]
  edit_address?: string | null
  finance_contact_emails: string[]
}

export interface Product {
  id: number
  qty: number
  name: string
  is_track: boolean
  avg_base_price: number
  base_price: number
  code: string
  bundle_type_id: number
  purchase_account_id: number
  sell_account_id: number
  unit_id: number
  pos_product_category_id: number
  wholesale_price: WholesalePrice[]
  is_purchase: boolean
  is_sell: boolean
  sn_type?: number | null
  manage_expiry?: boolean | null
  unit: Unit
}

export interface WholesalePrice {
  price: number
  min_qty: number
  use_discount_percent: number
}

export interface Unit {
  id: number
  name: string
}

export interface Item {
  id: number
  tran_id: number
  finance_account_id: number
  trans_type_id: number
  tax_id?: number | null
  desc?: string | null
  qty: number
  price: number
  price_after_tax: number
  amount: number
  amount_after_tax: number
  discount_percent: number
  discount_amount: number
  additional_discount_amount: number
  taxable: number
  tax: number
  subtotal: number
  unit_id: number
  unit_conv: number
  discount_amount_input?: string | null
  amount_after_tax_ori?: number | null
  amount_ori?: number | null
  currency_id: number
  currency_rate: number
  local_id?: number | null
  product: Product
}

export interface Termin {
  id: number
  name: string
  days: number
}

export interface Tag {
  id: number
  name: string
  color: string
}

export interface Warehouse {
  id: number
  name: string
  code: string
  desc?: string | null
}

export interface TransaksiPolosan {
  id: number
  trans_date: string
  due_date: string
  status_id: number
  contact_id: number
  due: number
  amount_after_tax: number
  memo: string
  ref_number: string
  amount: number
  paid_date: string
  additional_discount_amount: number
  term_id: number
  attachment: any[]
  sales_id?: number | null
  warehouse_id: number
  currency_rate: number
  currency_id: number
  shipping_cost: number
  shipping_date?: string | null // Ditambahkan
  contact: Contact
  products: Product[]
  items: Item[]
  termin: Termin
  sales_person?: string | null
  attachment_exists: number
  tags: Tag[]
  print_status: string
  order_number?: string | null
  due_days: number
  qty: number
  warehouse: Warehouse
  witholding_account_id: number // Properti baru ditambahkan
  witholding_amount: number // Properti baru ditambahkan
  witholding_percent: number // Properti baru ditambahkan
  include_tax: number // Properti baru ditambahkan
  reason_id: number // Properti baru ditambahkan
  down_payment: number // Properti baru ditambahkan
}

export interface Item {
  id: number
  tran_id: number
  finance_account_id: number
  trans_type_id: number
  tax_id?: number | null
  desc?: string | null
  qty: number
  price: number
  price_after_tax: number
  amount: number
  amount_after_tax: number
  discount_percent: number
  discount_amount: number
  additional_discount_amount: number
  taxable: number
  tax: number
  subtotal: number
  unit_id: number
  unit_conv: number
  discount_amount_input?: string | null
  amount_after_tax_ori?: number | null // Ditambahkan
  amount_ori?: number | null // Ditambahkan
  currency_id: number
  currency_rate: number
  local_id?: number | null // Tetap ada, jika memang diperlukan
  product: Product
}

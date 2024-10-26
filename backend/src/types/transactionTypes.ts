export interface Contact {
  id: number
  name: string
  email: string | null
  phone: string | null
  company: string | null
  address: string
  country_id: number
  province_id: number | null
  city_id: number | null
  district_id: number | null
  village_id: number | null
  group_id: number
  salutation_id: number | null
  type_ids: number[]
  edit_address: string | null
  finance_contact_emails: string[]
}

export interface Product {
  name: string
  qty: number
  unit: string
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
  desc: string | null
}

export interface Transaction {
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
  attachment: any[] // Placeholder for attachment type
  sales_id: number | null
  warehouse_id: number
  currency_rate: number
  currency_id: number
  shipping_cost: number
  shipping_date: string | null
  contact: Contact
  products: Product[]
  termin: Termin
  sales_person: string | null
  attachment_exists: number
  tags: Tag[]
  print_status: string
  order_number: string | null
  due_days: number
  qty: number
  warehouse: Warehouse
}

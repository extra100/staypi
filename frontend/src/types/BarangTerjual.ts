export type Barter = {
  data: {
    data: {
      warehouse_id: number
      id: number
      trans_date: string
      due_date: string
      status_id: number
      contact_id: number
      due: number
      amount_after_tax: number
      ref_number: string
      amount: number
      additional_discount_amount: number
      currency_rate: number
      currency_id: number
      shipping_cost: number
      shipping_date: string | null
      business_tran_id: number | null
      contact: {
        id: number
        name: string
      }
      fees: any[]
      products: {
        name: string
        qty: number
        unit: string
      }[]
      reference: string
      tags: {
        id: number
        name: string
        color: string
      }[]
      city: string | null
      province: string | null
      warehouse: {
        id: number
        name: string
        code: string
        desc: string | null
      }
      items: {
        id: number
        tran_id: number
        finance_account_id: number
        trans_type_id: number
        tax_id: number | null
        desc: string
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
        discount_amount_input: string
        amount_after_tax_ori: number | null
        amount_ori: number | null
        currency_id: number
        currency_rate: number
        local_id: number | null
        product: {
          id: number
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
          wholesale_price: {
            price: number
            min_qty: number
            use_discount_percent: number
          }[]
          is_purchase: boolean
          is_sell: boolean
        }
        unit_name: string
      }[]
      grand_total: {
        subtotal: number
        tax: number
        discount_amount: number
        additional_discount_amount: number
        additional_discount_percent: number
        total: number
        due: number
        shipping_cost: number
        witholding: number | null
        return: number
        paid: number
      }
    }[]
  }
}

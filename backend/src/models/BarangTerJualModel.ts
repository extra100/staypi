import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'
class Contact {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public name!: string

  @prop()
  public email?: string | null

  @prop()
  public phone?: string | null

  @prop()
  public company?: string | null

  @prop({ default: '' })
  public address!: string

  @prop({ required: true })
  public country_id!: number

  @prop()
  public province_id?: number | null

  @prop()
  public city_id?: number | null

  @prop()
  public district_id?: number | null

  @prop()
  public village_id?: number | null

  @prop({ required: true })
  public group_id!: number

  @prop()
  public salutation_id?: number | null

  @prop({ type: () => [Number], default: [] })
  public type_ids!: number[]

  @prop()
  public edit_address?: string | null

  @prop({ type: () => [String], default: [] })
  public finance_contact_emails!: string[]
}

class Warehouse {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public code!: string

  @prop()
  public desc?: string | null
}

class GrandTotal {
  @prop({ required: true })
  public subtotal!: number

  @prop({ default: 0 })
  public tax!: number

  @prop({ required: true })
  public discount_amount!: number

  @prop({ default: 0 })
  public additional_discount_amount!: number

  @prop({ default: 0 })
  public additional_discount_percent!: number

  @prop({ required: true })
  public total!: number

  @prop({ default: 0 })
  public due!: number

  @prop({ default: 0 })
  public shipping_cost!: number

  @prop()
  public witholding?: number | null

  @prop({ default: 0 })
  public return!: number

  @prop({ required: true })
  public paid!: number
}

class Fee {
  // Define fee-related fields as needed
}
class ProductInfo {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public is_track!: boolean

  @prop({ required: true })
  public avg_base_price!: number

  @prop({ required: true })
  public base_price!: number

  @prop({ required: true })
  public code!: string

  @prop({ default: 0 })
  public bundle_type_id!: number

  @prop({ required: true })
  public purchase_account_id!: number

  @prop({ required: true })
  public sell_account_id!: number

  @prop({ required: true })
  public unit_id!: number

  @prop({ required: true })
  public pos_product_category_id!: number

  @prop({ type: () => [WholesalePrice], required: true })
  public wholesale_price!: WholesalePrice[]

  @prop({ required: true })
  public is_purchase!: boolean

  @prop({ required: true })
  public is_sell!: boolean
}
class Product {
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public qty!: number

  @prop({ required: true })
  public unit!: string
}

class Tag {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public color!: string
}

class Item {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public tran_id!: number

  @prop({ required: true })
  public finance_account_id!: number

  @prop({ required: true })
  public trans_type_id!: number

  @prop()
  public tax_id?: number | null

  @prop({ default: '' })
  public desc!: string

  @prop({ required: true })
  public qty!: number

  @prop({ required: true })
  public price!: number

  @prop({ required: true })
  public price_after_tax!: number

  @prop({ required: true })
  public amount!: number

  @prop({ required: true })
  public amount_after_tax!: number

  @prop({ required: true })
  public discount_percent!: number

  @prop({ required: true })
  public discount_amount!: number

  @prop({ default: 0 })
  public additional_discount_amount!: number

  @prop({ default: 0 })
  public taxable!: number

  @prop({ default: 0 })
  public tax!: number

  @prop({ required: true })
  public subtotal!: number

  @prop({ required: true })
  public unit_id!: number

  @prop({ required: true })
  public unit_conv!: number

  @prop({ required: true })
  public discount_amount_input!: string

  @prop()
  public amount_after_tax_ori?: number | null

  @prop()
  public amount_ori?: number | null

  @prop({ default: 0 })
  public currency_id!: number

  @prop({ default: 1 })
  public currency_rate!: number

  @prop()
  public local_id?: number | null

  @prop({ required: true, type: () => ProductInfo })
  public product!: ProductInfo

  @prop({ required: true })
  public unit_name!: string
}

class WholesalePrice {
  @prop({ required: true })
  public price!: number

  @prop({ required: true })
  public min_qty!: number

  @prop({ required: true })
  public use_discount_percent!: number
}
@modelOptions({ schemaOptions: { timestamps: true } })
export class BarterMod {
  @prop({ required: true })
  public id!: number
  @prop({ required: true })
  public trans_date!: string

  @prop({ required: true })
  public due_date!: string

  @prop({ required: true })
  public status_id!: number

  @prop({ required: true })
  public contact_id!: number

  @prop({ required: true })
  public due!: number

  @prop({ required: true })
  public amount_after_tax!: number

  @prop({ required: true })
  public ref_number!: string

  @prop({ required: true })
  public amount!: number

  @prop({ default: 0 })
  public additional_discount_amount!: number

  @prop({ required: true })
  public warehouse_id!: number

  @prop({ default: 1 })
  public currency_rate!: number

  @prop({ default: 0 })
  public currency_id!: number

  @prop({ default: 0 })
  public shipping_cost!: number

  @prop()
  public shipping_date?: Date | null

  @prop()
  public business_tran_id?: number | null

  @prop({ required: true, type: () => Contact })
  public contact!: Contact

  @prop({ type: () => [Fee], default: [] })
  public fees!: Fee[]

  @prop({ type: () => [Product], required: true })
  public products!: Product[]

  @prop({ default: '' })
  public reference?: string

  @prop({ type: () => [Tag], default: [] })
  public tags!: Tag[]

  @prop()
  public city?: string | null

  @prop()
  public province?: string | null

  @prop({ type: () => [Warehouse], required: true })
  public warehouses!: Warehouse[]

  @prop({ type: () => [Item], required: true })
  public items!: Item[]

  @prop({ required: true, type: () => GrandTotal })
  public grand_total!: GrandTotal
  @prop()
  public total?: string | null
}

export const TransactionModel = getModelForClass(BarterMod)

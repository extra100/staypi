import {
  modelOptions,
  prop,
  getModelForClass,
  Severity,
} from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
    // collection: 'transaksipolosans',
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Contact {
  @prop({ required: true })
  public id!: Number
  @prop({ required: true })
  public name!: string

  @prop()
  public email?: string | null

  @prop()
  public phone?: string | null

  @prop()
  public company?: string | null

  @prop({ required: true })
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

  @prop({ type: () => [Number], required: true })
  public type_ids!: number[]

  @prop()
  public edit_address?: string | null

  @prop({ type: () => [String], required: true })
  public finance_contact_emails!: string[]
}

export class Product {
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public qty!: number

  @prop({ required: true })
  public unit!: string
}

// export class Product {
//   @prop({ required: true })
//   public id!: number

//   @prop({ required: true })
//   public name!: string

//   @prop({ required: true })
//   public unit!: Unit

// Tambahan properti lainnya dari produk yang diperlukan
// }

export class Item {
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

  @prop()
  public desc?: string | null

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

  @prop({ required: true })
  public additional_discount_amount!: number

  @prop({ required: true })
  public taxable!: number

  @prop({ required: true })
  public tax!: number

  @prop({ required: true })
  public subtotal!: number

  @prop({ required: true })
  public unit_id!: number

  @prop({ required: true })
  public unit_conv!: number

  @prop()
  public discount_amount_input?: string | null

  @prop()
  public amount_after_tax_ori?: number | null

  @prop()
  public amount_ori?: number | null

  @prop({ required: true })
  public currency_id!: number

  @prop({ required: true })
  public currency_rate!: number

  @prop()
  public local_id?: number | null

  @prop()
  public product!: Product
}

export class Termin {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public days!: number
}

export class Tag {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public color!: string
}

export class Warehouse {
  @prop({ required: true })
  public id!: number

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public code!: string

  @prop()
  public desc?: string | null
}

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class TransaksiPolosan {
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
  public memo!: string

  @prop({ required: true })
  public ref_number!: string

  @prop({ required: true })
  public amount!: number

  @prop({ required: true })
  public paid_date!: string

  @prop({ required: true })
  public additional_discount_amount!: number

  @prop({ required: true })
  public term_id!: number

  @prop({ type: () => [String], required: true })
  public attachment!: any[]

  @prop()
  public sales_id?: number | null

  @prop({ required: true })
  public warehouse_id!: number

  @prop({ required: true })
  public currency_rate!: number

  @prop({ required: true })
  public currency_id!: number

  @prop({ required: true })
  public shipping_cost!: number

  @prop()
  public shipping_date?: string | null

  @prop({ type: () => Contact, required: true })
  public contact!: Contact

  @prop({ type: () => [Product], required: true })
  public products!: Product[]
  @prop({ type: () => [Item], required: true })
  public items!: Item[]
  @prop({ type: () => Termin, required: true })
  public termin!: Termin

  @prop()
  public sales_person?: string | null

  @prop({ required: true })
  public attachment_exists!: number

  @prop({ type: () => [Tag], required: true })
  public tags!: Tag[]

  @prop({ required: true })
  public print_status!: string

  @prop()
  public order_number?: string | null

  @prop({ required: true })
  public due_days!: number

  @prop({ required: true })
  public qty!: number

  @prop({ type: () => Warehouse, required: true })
  public warehouse!: Warehouse

  // New fields
  @prop({ required: true })
  public witholding_account_id!: number

  @prop({ required: true })
  public witholding_amount!: number

  @prop({ required: true })
  public witholding_percent!: number

  @prop({ required: true })
  public include_tax!: boolean

  @prop({ required: true })
  public reason_id!: number

  @prop({ required: true })
  public down_payment!: number
}

export const TransaksiPolosanModel = getModelForClass(TransaksiPolosan)

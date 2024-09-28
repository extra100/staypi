import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Contact {
  @prop({ required: true })
  public id!: number // Menggunakan tipe number sesuai dengan tipe dari API

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public group_id!: number // Tipe number sesuai dengan API

  @prop()
  public group?: {
    id: number
    name: string
  } // Menggunakan properti opsional untuk group

  public _id?: string // Optional MongoDB default ID field
}

export const ContactModel = getModelForClass(Contact)

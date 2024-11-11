import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Pelanggan {
  @prop({ required: true })
  public id!: number
  @prop({ required: true })
  public address!: string

  @prop({ required: true })
  public name!: string
  @prop({ required: true })
  public phone!: string

  @prop({ required: true })
  public group_id!: number

  @prop()
  public group?: {
    id: number
    name: string
  }

  public _id?: string
}

export const PelangganModel = getModelForClass(Pelanggan)

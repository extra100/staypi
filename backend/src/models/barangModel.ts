import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Barang {
  public _id?: string
  @prop({ required: true })
  public id!: number
  @prop({ required: true, unique: true })
  public name!: string
  @prop({ required: true, unique: true })
  public price!: number
  @prop({ required: true, unique: true })
  public unit_id!: number
  @prop({ required: true, unique: true })
  public unit?: {
    id: number
    name: string
  }
}
export const BarangModel = getModelForClass(Barang)

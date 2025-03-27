import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Warehouses {
  public _id?: string
  @prop({ required: true })
  public id!: number
  @prop({ required: true, unique: true })
  public name!: string
  @prop({ required: true, unique: true })
  public code!: string
}
export const WarehousesGetDb = getModelForClass(Warehouses)

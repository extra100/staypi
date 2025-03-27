import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class AmbilDetailBarangDariGoret {
  public _id?: string
  @prop({ required: true })
  public id!: number
  @prop({ required: true })
  public name!: string
  @prop({ required: true })
  public code!: string
  @prop({ required: true })
  public stock!: number
  @prop({ required: true })
  public warehouse_id!: number
  @prop({ required: true })
  public start_date!: string
}

export const AmbilDetailBarangDariGoretModel = getModelForClass(
  AmbilDetailBarangDariGoret
)

import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Outlet {
  public _id?: string
  @prop({ required: true })
  public id_outlet!: string
  @prop({ required: true })
  public nama_outlet!: string
  @prop({ required: true })
  public bm!: string
  @prop({ required: true })
  public lokasi!: string
  @prop({ required: true })
  public cp!: number
}

export const OutletModel = getModelForClass(Outlet)

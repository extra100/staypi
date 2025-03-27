import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Stok {
  public _id?: string

  @prop({ required: true })
  public jumlah_stok!: number
  @prop({ required: true })
  public id_data_barang!: string
  @prop({ required: true })
  public id_outlet!: string
}

export const StokModel = getModelForClass(Stok)

import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Perhitungan {
  public _id?: string
  @prop({ required: true })
  public type!: string
  @prop({ required: true })
  public id_data_barang!: number
  @prop({ required: true })
  public qty!: number
  @prop({ required: true })
  public tanggal!: string
}

export const PerhitunganModel = getModelForClass(Perhitungan)

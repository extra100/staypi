import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Usaha {
  public _id?: string
  @prop({ required: true })
  public id_usaha!: string
  @prop({ required: true })
  public nama_usaha!: string
  @prop({ required: true })
  public alamat!: string
  @prop({ required: true })
  public kontak!: string
}

export const UsahaModel = getModelForClass(Usaha)

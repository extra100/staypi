import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class TipeKontak {
  public _id?: string
  @prop({ required: false })
  public id_type_kontak!: string
  @prop({ required: true })
  public type_kontak!: string
}
export const TypeKontakModel = getModelForClass(TipeKontak)

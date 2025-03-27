import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class AkunBank {
  public _id?: string
  @prop({ required: true })
  public id!: number
  @prop({ required: true, unique: true })
  public name!: string
}
export const AkunBankModel = getModelForClass(AkunBank)

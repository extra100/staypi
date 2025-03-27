import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Tag {
  public _id?: string
  @prop({ required: true })
  public id!: number
  @prop({ required: true, unique: true })
  public name!: string
}
export const TagModel = getModelForClass(Tag)

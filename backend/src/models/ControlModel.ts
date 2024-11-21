import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class Control {
  public _id?: string
  @prop({ required: true })
  public name!: string
}

export const ControlModel = getModelForClass(Control)

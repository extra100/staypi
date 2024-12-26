import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ControlModel } from '../models/ControlModel'

export const controlRouter = express.Router()
controlRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await ControlModel.find({})
    res.json(bebas)
  })
)


controlRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body

    const justHere = await ControlModel.findById(req.params.edi)

    if (justHere) {
      justHere.name = name || justHere.name

      const silahkanBebas = await justHere.save()
      res.json(silahkanBebas)
    } else {
      res.status(404).json({ message: 'Control not found' })
    }
  })
)

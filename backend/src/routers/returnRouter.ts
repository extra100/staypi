import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ReturnModel } from '../models/returnModels'

export const returnRouter = express.Router()
returnRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await ReturnModel.create(posData)
    res.status(201).json(justPos)
  })
)
returnRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await ReturnModel.find({})
    res.json(bebas)
  })
)

returnRouter.get(
  '/:ref_number',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await ReturnModel.find({
      ref_number: req.params.ref_number,
    })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await ReturnModel.findById(req.params.ref_number)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)

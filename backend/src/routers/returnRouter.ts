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

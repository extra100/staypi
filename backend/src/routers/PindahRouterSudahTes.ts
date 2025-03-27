import asyncHandler from 'express-async-handler'
import { WarehouseTransferModel } from '../models/pindahModel'
import express, { Request, Response } from 'express'

export const warehouseTransferRouter = express.Router()

warehouseTransferRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const transferData = req.body

      const updatedTransfer = await WarehouseTransferModel.findOneAndUpdate(
        { ref_number: transferData.ref_number },
        transferData,
        { new: true, upsert: true }
      )
      res.status(200).json(updatedTransfer)
    } catch (error) {
      console.error('Error saat membuat transfer:', error)
      res.status(500).json({ message: 'Terjadi kesalahan pada server' })
    }
  })
)

warehouseTransferRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const transfers = await WarehouseTransferModel.find()
      res.status(200).json(transfers)
    } catch (error) {
      console.error('Error saat mengambil transfer:', error)
      res.status(500).json({ message: 'Terjadi kesalahan pada server' })
    }
  })
)

warehouseTransferRouter.get(
  '/:ref_number',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await WarehouseTransferModel.find({
      ref_number: req.params.ref_number,
    })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await WarehouseTransferModel.findById(
        req.params.ref_number
      )
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)

export default warehouseTransferRouter

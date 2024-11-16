import asyncHandler from 'express-async-handler'
import { WarehouseTransferModel } from '../models/pindahModel'
import express, { Request, Response } from 'express'

export const warehouseTransferRouter = express.Router()

warehouseTransferRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const transferData = req.body

      const addTransfer = await WarehouseTransferModel.findOneAndUpdate(
        { ref_number: transferData.ref_number },
        transferData,
        { new: true, upsert: true }
      )
      res.status(200).json(addTransfer)
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

warehouseTransferRouter.put(
  '/by-id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    const mutation = await WarehouseTransferModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!mutation) {
      return res.status(404).json({ message: 'Mutasi Tak Ditemukan' })
    }

    if (req.body.id) {
      mutation.id = req.body.id
    }

    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      mutation.items = mutation.items.map((item) => {
        // cocokan payload kence database
        const updatedItem = req.body.items.find(
          (i: any) => i.finance_account_id === item.finance_account_id
        )

        if (updatedItem) {
          // update isi items isik data bru
          return { ...item, id: updatedItem.id }
        }

        return item
      })

      // Simpan jok database
      const updatedMutation = await mutation.save()

      res.json(updatedMutation)
    }
  })
)

warehouseTransferRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      let warehouseTransfer = await WarehouseTransferModel.findOne({
        ref_number: req.params.eid,
      })

      if (!warehouseTransfer) {
        warehouseTransfer = await WarehouseTransferModel.findById(
          req.params.eid
        )
      }

      if (warehouseTransfer) {
        const {
          from_warehouse_id,
          to_warehouse_id,
          from_warehouse_name,
          to_warehouse_name,
          ref_number,
          memo,
          items,
          attachment,
          trans_date,
          code, // Ambil code dari req.body
        } = req.body

        warehouseTransfer.from_warehouse_id =
          from_warehouse_id || warehouseTransfer.from_warehouse_id
        warehouseTransfer.to_warehouse_id =
          to_warehouse_id || warehouseTransfer.to_warehouse_id
        warehouseTransfer.from_warehouse_name =
          from_warehouse_name || warehouseTransfer.from_warehouse_name
        warehouseTransfer.to_warehouse_name =
          to_warehouse_name || warehouseTransfer.to_warehouse_name
        warehouseTransfer.ref_number =
          ref_number || warehouseTransfer.ref_number
        warehouseTransfer.memo = memo || warehouseTransfer.memo
        warehouseTransfer.items = items || warehouseTransfer.items
        warehouseTransfer.attachment =
          attachment || warehouseTransfer.attachment
        warehouseTransfer.trans_date =
          trans_date || warehouseTransfer.trans_date

        // Update code
        warehouseTransfer.code = code || warehouseTransfer.code

        const updatedTransfer = await warehouseTransfer.save()

        res.status(200).json(updatedTransfer)
      } else {
        res.status(404).json({ message: 'Warehouse transfer not found' })
      }
    } catch (error) {
      console.error('Error updating warehouse transfer:', error)
      res.status(500).json({ message: 'Server error' })
    }
  })
)

export default warehouseTransferRouter

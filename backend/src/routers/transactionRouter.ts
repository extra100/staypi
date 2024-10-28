import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { TransactionModel } from '../models/transactionModel'

export const transactionRouter = express.Router()
transactionRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await TransactionModel.create(posData)
    res.status(201).json(justPos)
  })
)

transactionRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await TransactionModel.find({})
    res.json(bebas)
  })
)

transactionRouter.get(
  '/:ref_number',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await TransactionModel.find({
      ref_number: req.params.ref_number,
    })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await TransactionModel.findById(req.params.ref_number)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)
// PUT endpoint to update transaction by ref_number
transactionRouter.put(
  '/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    // Cari transaksi berdasarkan ref_number yang diberikan dalam URL
    let transaction = await TransactionModel.findOne({
      ref_number: req.params.ref_number,
    })

    // Jika transaksi tidak ditemukan, kirimkan respons 404
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Periksa apakah field `witholdings` ada dalam request body dan update jika ada
    if (req.body.witholdings && Array.isArray(req.body.witholdings)) {
      // Update field `witholdings` pada transaksi yang ditemukan
      transaction.witholdings = req.body.witholdings
    }

    // Lakukan update pada field lain (misalnya `reason_id` atau lainnya)
    if (req.body.reason_id) {
      transaction.reason_id = req.body.reason_id
    }

    // Tambahkan pembaruan untuk field lain yang diperlukan sesuai dengan model transaksi

    // Simpan transaksi yang diperbarui ke database
    const updatedTransaction = await transaction.save()

    // Kirimkan respons dengan data transaksi yang diperbarui
    res.json(updatedTransaction)
  })
)

transactionRouter.delete(
  '/:idol',
  asyncHandler(async (req, res) => {
    const teneDwang = await TransactionModel.findByIdAndDelete(req.params.idol)
    if (teneDwang) {
      res.json({ message: 'Pos deleted successfully' })
    } else {
      res.status(404).json({ message: 'Pos Not Found' })
    }
  })
)

export default transactionRouter

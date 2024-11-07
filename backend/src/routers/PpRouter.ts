import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { PpModel } from '../models/ppModel'

export const ppRouter = express.Router()
ppRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await PpModel.create(posData)
    res.status(201).json(justPos)
  })
)

ppRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await PpModel.find({})
    res.json(bebas)
  })
)

ppRouter.get(
  '/:ref_number',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await PpModel.find({
      ref_number: req.params.ref_number,
    })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await PpModel.findById(req.params.ref_number)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)
// PUT endpoint to update pp by ref_number
// ppRouter.put(
//   '/:ref_number',
//   asyncHandler(async (req: any, res: any) => {
//     // Cari transaksi berdasarkan ref_number yang diberikan dalam URL
//     let transaction = await PpModel.findOne({
//       ref_number: req.params.ref_number,
//     })

//     // Jika transaksi tidak ditemukan, kirimkan respons 404
//     if (!transaction) {
//       return res.status(404).json({ message: 'Transaction not found' })
//     }

//     // Periksa apakah field `witholdings` ada dalam request body dan update jika ada
//     if (req.body.witholdings && Array.isArray(req.body.witholdings)) {
//       // Update field `witholdings` pada transaksi yang ditemukan
//       transaction.witholdings = req.body.witholdings
//     }

//     // Lakukan update pada field lain (misalnya `reason_id` atau lainnya)
//     if (req.body.id) {
//       transaction.id = req.body.id
//     }
//     // if (req.body.id) {
//     //   transaction.id = req.body.id
//     // }

//     // Tambahkan pembaruan untuk field lain yang diperlukan sesuai dengan model transaksi

//     // Simpan transaksi yang diperbarui ke database
//     const updatePemesananMutation = await transaction.save()

//     // Kirimkan respons dengan data transaksi yang diperbarui
//     res.json(updatePemesananMutation)
//   })
// )

// ppRouter.delete(
//   '/:idol',
//   asyncHandler(async (req, res) => {
//     const teneDwang = await PpModel.findByIdAndDelete(req.params.idol)
//     if (teneDwang) {
//       res.json({ message: 'Pos deleted successfully' })
//     } else {
//       res.status(404).json({ message: 'Pos Not Found' })
//     }
//   })
// )
ppRouter.put(
  '/by-id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    console.log('Ref Number in Request:', req.params.ref_number)

    const transaction = await PpModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (req.body.id) {
      transaction.id = req.body.id
    }

    const updatedTransaction = await transaction.save()
    res.json(updatedTransaction)
  })
)

ppRouter.delete(
  '/:ref_number/witholdings/:witholdingId',
  asyncHandler(async (req: Request, res: Response) => {
    const { ref_number, witholdingId } = req.params

    const pp = await PpModel.findOne({ ref_number })

    if (pp) {
      pp.witholdings = pp.witholdings.filter(
        (witholding: any) => witholding._id.toString() !== witholdingId
      )

      await pp.save()
      res.json({ message: 'Witholding removed successfully' })
    } else {
      res.status(404).json({ message: 'Pp not found' })
    }
  })
)
ppRouter.patch(
  '/:ref_number/witholding/:witholdingId',
  asyncHandler(async (req: any, res: any) => {
    const { ref_number, witholdingId } = req.params
    const { status } = req.body

    const pp = await PpModel.findOne({
      ref_number,
      'witholdings._id': witholdingId,
    })

    if (!pp) {
      return res.status(404).json({ message: 'Pp or witholding not found' })
    }

    const withholding = pp.witholdings.find(
      (witholding: any) => witholding._id.toString() === witholdingId
    )

    if (!withholding) {
      return res.status(404).json({ message: 'Withholding not found' })
    }

    withholding.status = status // Update the percent

    await pp.save()
    res.status(200).json({ message: 'Withholding updated successfully' })
  })
)

export default ppRouter

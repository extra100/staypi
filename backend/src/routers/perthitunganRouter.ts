import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { PerhitunganModel } from '../models/perhitunganModel'

export const perhitunganRouter = express.Router()

perhitunganRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const agg = [
      {
        $group: {
          _id: '$finance_account_id',
          totalQty: { $sum: '$qty' },
          totalPersen: '$discount_percent',
        },
      },
    ]

    try {
      const result = await PerhitunganModel.aggregate(agg)
      res.json(result)
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Terjadi kesalahan saat melakukan agregasi' })
    }
  })
)

export default perhitunganRouter

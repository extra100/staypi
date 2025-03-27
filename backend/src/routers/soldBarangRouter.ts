import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { TransaksiPolosanModel } from '../models/TransaksiPolosanModel'
import express, { Request, Response } from 'express'

const soldBarangRouter = express.Router()

// Fungsi untuk memformat tanggal ke format DD-MM-YYYY
const formatDate = (date: string) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // bulan dimulai dari 0
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

const buildSoldBarang = ({
  startDate,
  endDate,
  warehouse_id,
  contact_id,
}: {
  startDate: string
  endDate: string
  warehouse_id?: number
  contact_id?: any // Menambahkan parameter contact_id
}) => {
  const query: Record<string, any> = {
    trans_date: { $gte: startDate, $lte: endDate },
  }

  if (warehouse_id) {
    query.warehouse_id = Number(warehouse_id) // Mengonversi string menjadi number
  }

  if (contact_id) {
    query.contact_id = contact_id
  }

  return query
}

soldBarangRouter.get(
  '/',
  expressAsyncHandler(async (req: any, res: any) => {
    try {
      const { startDate, endDate, warehouse_id, contact_id } = req.query

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Missing startDate or endDate' })
      }

      const [startDay, startMonth, startYear] = startDate.split('-')
      const start = new Date(`${startYear}-${startMonth}-${startDay}`)
        .toISOString()
        .split('T')[0]

      const [endDay, endMonth, endYear] = endDate.split('-')
      const end = new Date(`${endYear}-${endMonth}-${endDay}`)
        .toISOString()
        .split('T')[0]

      const query = buildSoldBarang({
        startDate: start,
        endDate: end,
        warehouse_id,
        contact_id,
      })

      const agg = [
        { $match: query },
        { $unwind: '$items' },
        {
          $group: {
            _id: {
              finance_account_id: '$items.finance_account_id',
              contact_id: '$contact_id',
            },
            totalQty: { $sum: '$items.qty' },
          },
        },
        {
          $project: {
            finance_account_id: '$_id.finance_account_id',
            contact_id: '$_id.contact_id',
            totalQty: 1,
            _id: 0,
          },
        },
      ]

      const result = await TransaksiPolosanModel.aggregate(agg)

      res.status(200).json(result)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

export default soldBarangRouter

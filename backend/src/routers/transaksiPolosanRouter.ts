import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { TransaksiPolosanModel } from '../models/TransaksiPolosanModel'
import express, { Request, Response } from 'express'

const transaksiPolosanRouter = express.Router()

transaksiPolosanRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const posData = req.body
      const justPos = await TransaksiPolosanModel.create(posData)
      res.status(201).json(justPos)
    } catch (error) {
      console.error('Error saving transaction:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

// Fungsi untuk memformat tanggal ke format DD-MM-YYYY
const formatDate = (date: string) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // bulan dimulai dari 0
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

// Memperbarui fungsi buildTransactionQuery untuk menerima contact_id
const buildTransactionQuery = ({
  startDate,
  endDate,
  warehouse_id,
  contact_id, // Menambahkan parameter contact_id
}: {
  startDate: string
  endDate: string
  warehouse_id?: any
  contact_id?: any // Menambahkan parameter contact_id
}) => {
  const query: Record<string, any> = {
    trans_date: { $gte: startDate, $lte: endDate },
  }

  if (warehouse_id) {
    query.warehouse_id = warehouse_id
  }

  if (contact_id) {
    query.contact_id = contact_id // Menambahkan filter untuk contact_id
  }

  return query
}

// Route handler
transaksiPolosanRouter.get(
  '/',
  expressAsyncHandler(async (req: any, res: any) => {
    try {
      const { startDate, endDate, warehouse_id, contact_id } = req.query

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Missing startDate or endDate' })
      }

      const [startDay, startMonth, startYear] = (startDate as string).split('-')
      const start = new Date(`${startYear}-${startMonth}-${startDay}`)
        .toISOString()
        .split('T')[0]

      const [endDay, endMonth, endYear] = (endDate as string).split('-')
      const end = new Date(`${endYear}-${endMonth}-${endDay}`)
        .toISOString()
        .split('T')[0]

      const query = buildTransactionQuery({
        startDate: start,
        endDate: end,
        warehouse_id,
        contact_id,
      })

      const transactions = await TransaksiPolosanModel.find(query)

      const result = transactions.map((transaction) => ({
        ref_number: transaction.ref_number,
        status_id: transaction.status_id,
        contact_id: transaction.contact_id,
        nama_pelanggan: transaction.contact.name,
        items: transaction.items.map((item) => ({
          jenis_diskon: item.discount_percent || 0,
        })),
        tags: transaction.tags.map((tag) => ({
          name: tag.name,
        })),
        trans_date: formatDate(transaction.trans_date),
        amount: transaction.amount,
        warehouse_id: transaction.warehouse ? transaction.warehouse.id : null,
        warehouse_name: transaction.warehouse
          ? transaction.warehouse.name
          : null,
        due: transaction.due,
        witholding_account_id: transaction.witholding_account_id || 0,
        witholding_amount: transaction.witholding_amount || 0,
        witholding_percent: transaction.witholding_percent || 0,
        include_tax: transaction.include_tax || 0,
        reason_id: transaction.reason_id || 0,
        down_payment: transaction.down_payment || 0,
        id: transaction.id || 0,
      }))

      res.status(200).json(result)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

export default transaksiPolosanRouter

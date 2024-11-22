import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { TransactionModel } from '../models/transactionModel'

export const transactionRouter = express.Router()

transactionRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { date_from, date_to, warehouse_id } = req.query

    const conditions: any = {}

    if (date_from && date_to) {
      conditions.trans_date = date_from
      console.log('Date condition:', conditions.trans_date)
    }

    if (warehouse_id) {
      conditions.warehouse_id = Number(warehouse_id)
      console.log('Warehouse condition:', conditions.warehouse_id)
    }

    console.log('Final query conditions:', conditions)

    const transactions = await TransactionModel.find(conditions)

    console.log('Transactions found:', transactions)

    res.json(transactions)
  })
)

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

transactionRouter.put(
  '/by-id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    const transaction = await TransactionModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (req.body.id) {
      transaction.id = req.body.id
    }

    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      transaction.items = transaction.items.map((item) => {
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
      const updatedTransaction = await transaction.save()

      res.json(updatedTransaction)
    }
  })
)

transactionRouter.put(
  '/by-contact_id/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    console.log('Ref Number in Request:', req.params.ref_number)

    const transaction = await TransactionModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (req.body.contact_id) transaction.contact_id = req.body.contact_id
    if (req.body.term_id) transaction.term_id = req.body.term_id
    if (req.body.trans_date) transaction.trans_date = req.body.trans_date
    if (req.body.due_date) transaction.due_date = req.body.due_date
    if (req.body.id) transaction.id = req.body.id

    if (Array.isArray(req.body.contacts) && req.body.contacts.length > 0) {
      transaction.contacts = req.body.contacts
    }
    if (Array.isArray(req.body.tages) && req.body.tages.length > 0) {
      transaction.tages = req.body.tages
    }
    const updatedTransaction = await transaction.save()
    return res.json(updatedTransaction)
  })
)

transactionRouter.put(
  '/full-update/:ref_number',
  asyncHandler(async (req: any, res: any) => {
    let transaction = await TransactionModel.findOne({
      ref_number: req.params.ref_number,
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    if (req.body.witholdings && Array.isArray(req.body.witholdings)) {
      transaction.witholdings = req.body.witholdings
    }

    if (req.body.reason_id) {
      transaction.reason_id = req.body.reason_id
    }

    const updatedTransaction = await transaction.save()

    res.json(updatedTransaction)
  })
)

// transactionRouter.delete(
//   '/:idol',
//   asyncHandler(async (req, res) => {
//     const teneDwang = await TransactionModel.findByIdAndDelete(req.params.idol)
//     if (teneDwang) {
//       res.json({ message: 'Pos deleted successfully' })
//     } else {
//       res.status(404).json({ message: 'Pos Not Found' })
//     }
//   })
// )

transactionRouter.delete(
  '/:ref_number/witholdings/:witholdingId',
  asyncHandler(async (req: Request, res: Response) => {
    const { ref_number, witholdingId } = req.params

    const transaction = await TransactionModel.findOne({ ref_number })

    if (transaction) {
      transaction.witholdings = transaction.witholdings.filter(
        (witholding: any) => witholding._id.toString() !== witholdingId
      )

      await transaction.save()
      res.json({ message: 'Witholding removed successfully' })
    } else {
      res.status(404).json({ message: 'Transaction not found' })
    }
  })
)
transactionRouter.patch(
  '/:ref_number/witholding/:witholdingId',
  asyncHandler(async (req: any, res: any) => {
    const { ref_number, witholdingId } = req.params
    const { status } = req.body

    const transaction = await TransactionModel.findOne({
      ref_number,
      'witholdings._id': witholdingId,
    })

    if (!transaction) {
      return res
        .status(404)
        .json({ message: 'Transaction or witholding not found' })
    }

    const withholding = transaction.witholdings.find(
      (witholding: any) => witholding._id.toString() === witholdingId
    )

    if (!withholding) {
      return res.status(404).json({ message: 'Withholding not found' })
    }

    withholding.status = status // Update the percent

    await transaction.save()
    res.status(200).json({ message: 'Withholding updated successfully' })
  })
)

export default transactionRouter

// import express, { Request, Response } from 'express'
// import asyncHandler from 'express-async-handler'

// import { TransactionModel } from '../models/transactionModel'

// export const transactionRouter = express.Router()
// transactionRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const posData = req.body

//     const justPos = await TransactionModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )

// transactionRouter.get(
//   '/',
//   asyncHandler(async (req: Request, res: Response) => {
//     const bebas = await TransactionModel.find({})
//     res.json(bebas)
//   })
// )

// transactionRouter.get(
//   '/:ref_number',
//   asyncHandler(async (req: Request, res: Response) => {
//     const posData = await TransactionModel.find({
//       ref_number: req.params.ref_number,
//     })
//     if (posData && posData.length > 0) {
//       res.json(posData)
//     } else {
//       const posById = await TransactionModel.findById(req.params.ref_number)
//       if (posById) {
//         res.json(posById)
//       } else {
//         res.status(404).json({ message: 'Pos not found' })
//       }
//     }
//   })
// )
// // PUT endpoint to update transaction by ref_number
// transactionRouter.put(
//   '/:ref_number',
//   asyncHandler(async (req: any, res: any) => {
//     // Cari transaksi berdasarkan ref_number yang diberikan dalam URL
//     let transaction = await TransactionModel.findOne({
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
//     if (req.body.id) {
//       transaction.id = req.body.id
//     }

//     // Tambahkan pembaruan untuk field lain yang diperlukan sesuai dengan model transaksi

//     // Simpan transaksi yang diperbarui ke database
//     const updatedTransaction = await transaction.save()

//     // Kirimkan respons dengan data transaksi yang diperbarui
//     res.json(updatedTransaction)
//   })
// )
transactionRouter.put(
  '/:ref_number/witholdings/:witholdingId',
  asyncHandler(async (req: any, res: any) => {
    const { ref_number, witholdingId } = req.params
    const { trans_date, down_payment } = req.body

    // Cek apakah ref_number dan witholdingId ada
    if (!ref_number || !witholdingId) {
      return res
        .status(400)
        .json({ message: 'Missing ref_number or witholdingId' })
    }

    // Cari transaksi berdasarkan ref_number
    const transaction = await TransactionModel.findOne({ ref_number })
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Cari witholding yang sesuai dengan witholdingId
    const witholding = transaction.witholdings.find(
      (item: any) => item._id.toString() === witholdingId
    )

    if (!witholding) {
      return res.status(404).json({ message: 'Witholding not found' })
    }

    // Update fields with new values
    witholding.trans_date = trans_date || witholding.trans_date
    witholding.down_payment = down_payment || witholding.down_payment

    // Simpan transaksi yang sudah diperbarui
    await transaction.save()

    // Kirim kembali data transaksi yang sudah diperbarui
    res.json(transaction)
  })
)

// // transactionRouter.delete(
// //   '/:idol',
// //   asyncHandler(async (req, res) => {
// //     const teneDwang = await TransactionModel.findByIdAndDelete(req.params.idol)
// //     if (teneDwang) {
// //       res.json({ message: 'Pos deleted successfully' })
// //     } else {
// //       res.status(404).json({ message: 'Pos Not Found' })
// //     }
// //   })
// // )

// transactionRouter.delete(
//   '/:ref_number/witholdings/:witholdingId',
//   asyncHandler(async (req: Request, res: Response) => {
//     const { ref_number, witholdingId } = req.params

//     const transaction = await TransactionModel.findOne({ ref_number })

//     if (transaction) {
//       transaction.witholdings = transaction.witholdings.filter(
//         (witholding: any) => witholding._id.toString() !== witholdingId
//       )

//       await transaction.save()
//       res.json({ message: 'Witholding removed successfully' })
//     } else {
//       res.status(404).json({ message: 'Transaction not found' })
//     }
//   })
// )
// transactionRouter.patch(
//   '/:ref_number/witholding/:witholdingId',
//   asyncHandler(async (req: any, res: any) => {
//     const { ref_number, witholdingId } = req.params
//     const { status } = req.body

//     const transaction = await TransactionModel.findOne({
//       ref_number,
//       'witholdings._id': witholdingId,
//     })

//     if (!transaction) {
//       return res
//         .status(404)
//         .json({ message: 'Transaction or witholding not found' })
//     }

//     const withholding = transaction.witholdings.find(
//       (witholding: any) => witholding._id.toString() === witholdingId
//     )

//     if (!withholding) {
//       return res.status(404).json({ message: 'Withholding not found' })
//     }

//     withholding.status = status // Update the percent

//     await transaction.save()
//     res.status(200).json({ message: 'Withholding updated successfully' })
//   })
// )

// export default transactionRouter

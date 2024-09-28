import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { TransactionModel } from '../models/transactionModel'

export const transactionRouter = express.Router()

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

transactionRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await TransactionModel.create(posData)
    res.status(201).json(justPos)
  })
)

transactionRouter.put(
  '/:eid',
  asyncHandler(async (req: Request, res: Response) => {
    let onlyHereSpos = await TransactionModel.findOne({
      id_kerja_sama: req.params.eid,
    })

    if (!onlyHereSpos) {
      onlyHereSpos = await TransactionModel.findById(req.params.eid)
    }

    if (onlyHereSpos) {
      const {
        _id,
        trans_date,
        due_date,
        contact_id,
        contact_shipping_address_id,
        sales_id,
        status_id,
        include_tax,
        term_id,
        ref_number,
        memo,
        attachment,
        items,
        witholdings,
        warehouse_id,

        message,

        witholding_percent,
        witholding_amount,
        witholding_account_id,
      } = req.body

      onlyHereSpos._id = _id || onlyHereSpos._id
      onlyHereSpos.trans_date = trans_date || onlyHereSpos.trans_date
      onlyHereSpos.due_date = due_date || onlyHereSpos.due_date
      onlyHereSpos.contact_id = contact_id || onlyHereSpos.contact_id

      onlyHereSpos.sales_id = sales_id || onlyHereSpos.sales_id
      onlyHereSpos.status_id = status_id || onlyHereSpos.status_id
      onlyHereSpos.include_tax = include_tax || onlyHereSpos.include_tax
      onlyHereSpos.term_id = term_id || onlyHereSpos.term_id
      onlyHereSpos.ref_number = ref_number || onlyHereSpos.ref_number
      onlyHereSpos.memo = memo || onlyHereSpos.memo
      onlyHereSpos.attachment = attachment || onlyHereSpos.attachment
      onlyHereSpos.items = items || onlyHereSpos.items
      onlyHereSpos.witholdings = witholdings || onlyHereSpos.witholdings
      onlyHereSpos.warehouse_id = warehouse_id || onlyHereSpos.warehouse_id

      onlyHereSpos.message = message || onlyHereSpos.message
      // onlyHereSpos.tags = tags || onlyHereSpos.tags

      onlyHereSpos.witholding_percent =
        witholding_percent || onlyHereSpos.witholding_percent
      onlyHereSpos.witholding_amount =
        witholding_amount || onlyHereSpos.witholding_amount
      onlyHereSpos.witholding_account_id =
        witholding_account_id || onlyHereSpos.witholding_account_id

      const updatedPos = await onlyHereSpos.save()

      res.json(updatedPos)
    } else {
      res.status(404).json({ message: 'Transaction not found' })
    }
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

import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { BarangModel } from '../models/barangModel'

export const barangRouter = express.Router()

barangRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const barangs = await BarangModel.find()
      res.json(barangs)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

barangRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const productData = req.body
      delete productData._id

      const newProduct = await BarangModel.create(productData)
      res.status(201).json(newProduct)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)
barangRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { _id, id, name, code, price, pos_product_category_id } = req.body

    const cumaDisiniUsaha = await BarangModel.findById(req.params.edi)

    if (cumaDisiniUsaha) {
      cumaDisiniUsaha._id = _id || cumaDisiniUsaha._id

      cumaDisiniUsaha.id = id || cumaDisiniUsaha.id
      cumaDisiniUsaha.name = name || cumaDisiniUsaha.name
      cumaDisiniUsaha.code = code || cumaDisiniUsaha.code
      cumaDisiniUsaha.price = price || cumaDisiniUsaha.price
      cumaDisiniUsaha.pos_product_category_id =
        pos_product_category_id || cumaDisiniUsaha.pos_product_category_id

      const updateBarang = await cumaDisiniUsaha.save()
      res.json(updateBarang)
    } else {
      res.status(404).json({ message: 'Usaha not found' })
    }
  })
)

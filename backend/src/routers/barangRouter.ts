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

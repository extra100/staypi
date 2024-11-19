import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ReturnModel } from '../models/returnModels'

export const returnRouter = express.Router()
returnRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await ReturnModel.create(posData)
    res.status(201).json(justPos)
  })
)
returnRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await ReturnModel.find({})
    res.json(bebas)
  })
)

returnRouter.get(
  '/:ref_number',
  asyncHandler(async (req: Request, res: Response) => {
    const posData = await ReturnModel.find({
      ref_number: req.params.ref_number,
    })
    if (posData && posData.length > 0) {
      res.json(posData)
    } else {
      const posById = await ReturnModel.findById(req.params.ref_number)
      if (posById) {
        res.json(posById)
      } else {
        res.status(404).json({ message: 'Pos not found' })
      }
    }
  })
)
returnRouter.put(
  '/by-id/:id',
  asyncHandler(async (req: any, res: any) => {
    console.log('Request Params ID:', req.params.id)
    console.log('Request Body:', req.body)

    const mutation = await ReturnModel.findOne({ id: req.params.id })
    if (!mutation) {
      console.log('Data tidak ditemukan!')
      return res.status(404).json({ message: 'Mutasi Tak Ditemukan' })
    }

    mutation.id = req.body.id
    const updatedMutation = await mutation.save()
    res.json(updatedMutation)
  })
)
returnRouter.put(
  '/by-id/:memo',
  asyncHandler(async (req: any, res: any) => {
    // Cari mutasi berdasarkan `memo`
    const mutation = await ReturnModel.findOne({
      memo: req.params.memo,
    })

    if (!mutation) {
      return res.status(404).json({ message: 'Mutasi Tak Ditemukan' })
    }

    // Perbarui hanya `id` jika ada di body request
    if (req.body.id) {
      mutation.id = req.body.id
    } else {
      return res.status(400).json({ message: 'ID tidak ditemukan di payload' })
    }

    // Simpan perubahan ke database
    const updatedMutation = await mutation.save()

    // Kirim respons dengan data yang diperbarui
    res.json(updatedMutation)
  })
)

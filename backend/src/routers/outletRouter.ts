import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { OutletModel } from '../models/outletModel'

export const outletRouter = express.Router()

outletRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await OutletModel.find({})
    res.json(bebas)
  })
)

outletRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await OutletModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Harga not found' })
    }
  })
)

outletRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justHarga = await OutletModel.create(beudoang)
    res.status(201).json(justHarga)
  })
)

outletRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_outlet, nama_outlet, bm, lokasi, cp } = req.body

    const justHere = await OutletModel.findById(req.params.edi)

    if (justHere) {
      justHere.id_outlet = id_outlet || justHere.id_outlet
      justHere.nama_outlet = nama_outlet || justHere.nama_outlet
      justHere.bm = bm || justHere.bm
      justHere.lokasi = lokasi || justHere.lokasi

      justHere.cp = cp || justHere.cp

      const silahkanBebas = await justHere.save()
      res.json(silahkanBebas)
    } else {
      res.status(404).json({ message: 'Harga not found' })
    }
  })
)

outletRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await OutletModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Harga deleted successfully' })
    } else {
      res.status(404).json({ message: 'Harga Not Found' })
    }
  })
)

export default outletRouter

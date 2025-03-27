import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

import { AmbilDetailBarangDariKledoModel } from '../models/AmbilDetailBarangDariKledoModel'

export const AmbilDetailBarangDariKledoRouter = express.Router()

AmbilDetailBarangDariKledoRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await AmbilDetailBarangDariKledoModel.find({})
    res.json(bebas)
  })
)

AmbilDetailBarangDariKledoRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await AmbilDetailBarangDariKledoModel.findById(
      req.params.ide
    )
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Harga not found' })
    }
  })
)

AmbilDetailBarangDariKledoRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justHarga = await AmbilDetailBarangDariKledoModel.create(beudoang)
    res.status(201).json(justHarga)
  })
)

AmbilDetailBarangDariKledoRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id, name, code, stock, cp } = req.body

    const justHere = await AmbilDetailBarangDariKledoModel.findById(
      req.params.edi
    )

    if (justHere) {
      justHere.id = id || justHere.id
      justHere.name = name || justHere.name
      justHere.code = code || justHere.code
      justHere.stock = stock || justHere.stock

      const silahkanBebas = await justHere.save()
      res.json(silahkanBebas)
    } else {
      res.status(404).json({ message: 'Harga not found' })
    }
  })
)

AmbilDetailBarangDariKledoRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await AmbilDetailBarangDariKledoModel.findByIdAndDelete(
      req.params.idin
    )
    if (teneDwang) {
      res.json({ message: 'Harga deleted successfully' })
    } else {
      res.status(404).json({ message: 'Harga Not Found' })
    }
  })
)

export default AmbilDetailBarangDariKledoRouter

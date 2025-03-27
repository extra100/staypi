import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { UsahaModel } from '../models/usahaModel'

export const usahaRouter = express.Router()

usahaRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await UsahaModel.find({})
    res.json(bebas)
  })
)

usahaRouter.get(
  '/:ide',
  asyncHandler(async (req: Request, res: Response) => {
    const angene = await UsahaModel.findById(req.params.ide)
    if (angene) {
      res.json(angene)
    } else {
      res.status(404).json({ message: 'Usaha not found' })
    }
  })
)

usahaRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justUsaha = await UsahaModel.create(beudoang)
    res.status(201).json(justUsaha)
  })
)

usahaRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id_usaha, nama_usaha, alamat, kontak } = req.body

    const cumaDisiniUsaha = await UsahaModel.findById(req.params.edi)

    if (cumaDisiniUsaha) {
      cumaDisiniUsaha.id_usaha = id_usaha || cumaDisiniUsaha.id_usaha
      cumaDisiniUsaha.nama_usaha = nama_usaha || cumaDisiniUsaha.nama_usaha
      cumaDisiniUsaha.alamat = alamat || cumaDisiniUsaha.alamat
      cumaDisiniUsaha.kontak = kontak || cumaDisiniUsaha.kontak

      const updatedUsaha = await cumaDisiniUsaha.save()
      res.json(updatedUsaha)
    } else {
      res.status(404).json({ message: 'Usaha not found' })
    }
  })
)

usahaRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await UsahaModel.findByIdAndDelete(req.params.idin)
    if (teneDwang) {
      res.json({ message: 'Usaha deleted successfully' })
    } else {
      res.status(404).json({ message: 'Usaha Not Found' })
    }
  })
)

export default usahaRouter

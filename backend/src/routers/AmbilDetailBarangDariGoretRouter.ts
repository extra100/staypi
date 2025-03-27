import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

import { AmbilDetailBarangDariGoretModel } from '../models/AmbilDetailBarangDariGoretModel'

export const AmbilDetailBarangDariGoretRouter = express.Router()

AmbilDetailBarangDariGoretRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const bebas = await AmbilDetailBarangDariGoretModel.find({})
    res.json(bebas)
  })
)

// AmbilDetailBarangDariGoretRouter.get(
//   '/:ide',
//   asyncHandler(async (req: Request, res: Response) => {
//     const angene = await AmbilDetailBarangDariGoretModel.findById(
//       req.params.ide
//     )
//     if (angene) {
//       res.json(angene)
//     } else {
//       res.status(404).json({ message: 'Harga not found' })
//     }
//   })
// )

AmbilDetailBarangDariGoretRouter.get(
  '/',
  asyncHandler(async (req: any, res: any) => {
    const warehouse_id = Number(req.query.warehouse_id) // Convert to number for warehouse_id

    // Find all items with matching warehouse_id
    const items = await AmbilDetailBarangDariGoretModel.find({ warehouse_id })

    if (items.length > 0) {
      console.log('Items found:', items)
      res.json(items) // Return array of items for the selected warehouse
    } else {
      console.log('No items found for the specified warehouse ID')
      res.status(404).json({
        message: 'No items found for the specified warehouse ID',
      })
    }
  })
)

// AmbilDetailBarangDariGoretRouter.get(
//   '/:ide',
//   asyncHandler(async (req: any, res: any) => {
//     // Parse warehouse_id and item_id from query parameters
//     const warehouse_id = Number(req.query.warehouse_id) // Convert to number for warehouse_id
//     const item_id = Number(req.query.id) // Convert to number for item id

//     // Get the ide from route parameters (this might not be used based on your description)
//     const ide = req.params.ide
//     console.log('Received item ID (for logging):', ide) // Log the received ID for reference

//     // Find the item with matching id and warehouse_id
//     const itemDetail = await AmbilDetailBarangDariGoretModel.findOne({
//       id: item_id, // Match using the product id
//       warehouse_id: warehouse_id,
//     })

//     if (itemDetail) {
//       // Log the stock value and other details
//       console.log('Item found:', itemDetail)
//       console.log('Stock Value:', itemDetail.stock)

//       // Return the stock (or qty) for the specific warehouse and item id
//       res.json({
//         id: itemDetail.id, // Product id
//         name: itemDetail.name, // Product name
//         warehouse_id: itemDetail.warehouse_id, // Warehouse id
//         stock: itemDetail.stock, // Stock value
//       })
//     } else {
//       console.log('Item not found for the specified warehouse and item ID')
//       res.status(404).json({
//         message: 'Item not found for the specified warehouse and item ID',
//       })
//     }
//   })
// )

AmbilDetailBarangDariGoretRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const beudoang = req.body
    delete beudoang._id
    const justHarga = await AmbilDetailBarangDariGoretModel.create(beudoang)
    res.status(201).json(justHarga)
  })
)

AmbilDetailBarangDariGoretRouter.put(
  '/:edi',
  asyncHandler(async (req: Request, res: Response) => {
    const { id, name, code, stock, cp } = req.body

    const justHere = await AmbilDetailBarangDariGoretModel.findById(
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

AmbilDetailBarangDariGoretRouter.delete(
  '/:idin',
  asyncHandler(async (req, res) => {
    const teneDwang = await AmbilDetailBarangDariGoretModel.findByIdAndDelete(
      req.params.idin
    )
    if (teneDwang) {
      res.json({ message: 'Harga deleted successfully' })
    } else {
      res.status(404).json({ message: 'Harga Not Found' })
    }
  })
)

export default AmbilDetailBarangDariGoretRouter

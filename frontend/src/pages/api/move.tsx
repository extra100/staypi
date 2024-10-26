// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import apiClient from '../apiClient'
// import { WarehouseTransfer } from '../types/Pindah'

// // export const useAddWarehouseTransferMutation = () => {
// //   const queryClient = useQueryClient()
// //   return useMutation(
// //     (transfer: WarehouseTransfer) =>
// //       apiClient.post<WarehouseTransfer>(`/api/transactions`, transfer),
// //     {
// //       onSuccess: () => {
// //         queryClient.invalidateQueries(['pindahs'])
// //       },
// //     }
// //   )
// // }

// export const useAddWarehouseTransferMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (regak: WarehouseTransfer) => {
//       const { _id, ...dataToSend } = regak
//       console.log('Data to Send:', dataToSend)

//       return apiClient.post<WarehouseTransfer>(`/api/transactions`, dataToSend)
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['pindahs'])
//       },
//     }
//   )
// }

// export const useGetWarehouseTransfersQuery = () => {
//   return useQuery<WarehouseTransfer[], Error>(['pindahs'], async () => {
//     const response = await apiClient.get<WarehouseTransfer[]>(`/api/pindahs`)
//     return response.data
//   })
// }

// export const useGetWarehouseTransferByRefQuery = (ref_number: string) => {
//   return useQuery<WarehouseTransfer, Error>(
//     ['pindahs', ref_number],
//     async () => {
//       const response = await apiClient.get<WarehouseTransfer>(
//         `/api/pindahs/${ref_number}`
//       )
//       return response.data
//     },
//     {
//       enabled: !!ref_number,
//     }
//   )
// }
// export const useUpdateWarehouseTransferMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation<
//     WarehouseTransfer,
//     Error,
//     { ref_number: string; updatedData: Partial<WarehouseTransfer> }
//   >(
//     async ({ ref_number, updatedData }) => {
//       const response = await apiClient.put<WarehouseTransfer>(
//         `/api/pindahs/${ref_number}`,
//         updatedData
//       )
//       return response.data
//     },
//     {
//       onSuccess: (data, { ref_number }) => {
//         queryClient.invalidateQueries(['pindahs', ref_number])
//       },
//     }
//   )
// }
// import asyncHandler from 'express-async-handler'
// import { WarehouseTransferModel } from '../models/pindahModel'
// import express, { Request, Response } from 'express'

// export const warehouseTransferRouter = express.Router()

// // warehouseTransferRouter.post(
// //   '/',
// //   asyncHandler(async (req: Request, res: Response) => {
// //     try {
// //       const transferData = req.body

// //       const addTransfer = await WarehouseTransferModel.findOneAndUpdate(
// //         { ref_number: transferData.ref_number },
// //         transferData,
// //         { new: true, upsert: true }
// //       )
// //       res.status(200).json(addTransfer)
// //     } catch (error) {
// //       console.error('Error saat membuat transfer:', error)
// //       res.status(500).json({ message: 'Terjadi kesalahan pada server' })
// //     }
// //   })
// // )

// warehouseTransferRouter.post(
//   '/',
//   asyncHandler(async (req, res) => {
//     const posData = req.body

//     const justPos = await WarehouseTransferModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )

// warehouseTransferRouter.get(
//   '/',
//   asyncHandler(async (req: Request, res: Response) => {
//     try {
//       const transfers = await WarehouseTransferModel.find()
//       res.status(200).json(transfers)
//     } catch (error) {
//       console.error('Error saat mengambil transfer:', error)
//       res.status(500).json({ message: 'Terjadi kesalahan pada server' })
//     }
//   })
// )

// warehouseTransferRouter.get(
//   '/:ref_number',
//   asyncHandler(async (req: Request, res: Response) => {
//     const posData = await WarehouseTransferModel.find({
//       ref_number: req.params.ref_number,
//     })
//     if (posData && posData.length > 0) {
//       res.json(posData)
//     } else {
//       const posById = await WarehouseTransferModel.findById(
//         req.params.ref_number
//       )
//       if (posById) {
//         res.json(posById)
//       } else {
//         res.status(404).json({ message: 'Pos not found' })
//       }
//     }
//   })
// )
// // warehouseTransferRouter.put(
// //   '/:eid',
// //   asyncHandler(async (req: Request, res: Response) => {
// //     try {
// //       let warehouseTransfer = await WarehouseTransferModel.findOne({
// //         ref_number: req.params.eid,
// //       })

// //       if (!warehouseTransfer) {
// //         warehouseTransfer = await WarehouseTransferModel.findById(
// //           req.params.eid
// //         )
// //       }

// //       if (warehouseTransfer) {
// //         const {
// //           from_warehouse_id,
// //           to_warehouse_id,
// //           from_warehouse_name,
// //           to_warehouse_name,
// //           ref_number,
// //           memo,
// //           items,
// //           attachment,
// //           trans_date,
// //         } = req.body

// //         warehouseTransfer.from_warehouse_id =
// //           from_warehouse_id || warehouseTransfer.from_warehouse_id
// //         warehouseTransfer.to_warehouse_id =
// //           to_warehouse_id || warehouseTransfer.to_warehouse_id
// //         warehouseTransfer.from_warehouse_name =
// //           from_warehouse_name || warehouseTransfer.from_warehouse_name
// //         warehouseTransfer.to_warehouse_name =
// //           to_warehouse_name || warehouseTransfer.to_warehouse_name
// //         warehouseTransfer.ref_number =
// //           ref_number || warehouseTransfer.ref_number
// //         warehouseTransfer.memo = memo || warehouseTransfer.memo
// //         warehouseTransfer.items = items || warehouseTransfer.items
// //         warehouseTransfer.attachment =
// //           attachment || warehouseTransfer.attachment
// //         warehouseTransfer.trans_date =
// //           trans_date || warehouseTransfer.trans_date

// //         const updatedTransfer = await warehouseTransfer.save()

// //         res.status(200).json(updatedTransfer)
// //       } else {
// //         res.status(404).json({ message: 'Warehouse transfer not found' })
// //       }
// //     } catch (error) {
// //       console.error('Error updating warehouse transfer:', error)
// //       res.status(500).json({ message: 'Server error' })
// //     }
// //   })
// // )

// export default warehouseTransferRouter
// import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

// @modelOptions({ schemaOptions: { timestamps: true } })
// export class WarehouseTransfer {
//   @prop({ required: true })
//   public trans_date?: string
//   @prop({ required: true })
//   public jalur?: string
//   @prop()
//   public due_date?: string
//   @prop()
//   public unique_id!: number
//   @prop()
//   public contact_id!: number
//   @prop()
//   public amount!: number
//   @prop()
//   public ref_transaksi!: string
//   @prop()
//   public down_payment!: number
//   @prop()
//   public reason_id!: string
//   @prop()
//   public sales_id?: number | null

//   @prop()
//   public status_id!: number

//   @prop()
//   public due!: number
//   @prop()
//   public include_tax!: number
//   //
//   @prop()
//   public term_id!: number

//   @prop()
//   public ref_number!: string
//   @prop()
//   public externalId!: number
//   @prop()
//   public memo?: string

//   @prop()
//   public attachment!: any[]

//   @prop({ type: () => [Item], required: true })
//   public items!: Item[]

//   @prop()
//   public witholdings!: Witholding[]

//   @prop()
//   public contacts!: Contact[]
//   @prop({ type: () => [Warehouses], required: true })
//   public warehouses!: Warehouses[]

//   @prop({ required: true })
//   public warehouse_id?: number

//   @prop()
//   public message?: string

//   @prop()
//   public tages!: Tages[]

//   @prop()
//   public witholding_percent!: number

//   @prop()
//   public witholding_amount!: number

//   @prop()
//   public witholding_account_id!: number
// }

// class Item {
//   @prop({ required: true })
//   public finance_account_id!: number
//   @prop()
//   public name!: string

//   @prop({ required: true })
//   public qty!: number
//   @prop({ required: true })
//   public qty_update!: number

//   @prop({ required: true })
//   public price!: number

//   @prop()
//   public amount!: number

//   @prop()
//   public discount_percent!: number

//   @prop()
//   public discount_amount!: number
//   @prop()
//   public unit_id!: number
//   @prop()
//   public satuan!: string
// }

// class Witholding {
//   @prop()
//   public witholding_account_id!: number
//   @prop()
//   public down_payment!: number
//   @prop()
//   public name!: string
//   @prop()
//   public witholding_amount!: number

//   @prop()
//   public witholding_percent!: number
// }
// class Contact {
//   @prop()
//   public id!: number

//   @prop()
//   public name!: string
// }
// class Warehouses {
//   @prop({ required: true })
//   public warehouse_id!: number

//   @prop({ required: true })
//   public name!: string
// }
// class Tages {
//   @prop({ required: true })
//   public id!: number

//   @prop({ required: true })
//   public name!: string
// }

// export const WarehouseTransferModel = getModelForClass(WarehouseTransfer)
// import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'

// @modelOptions({ schemaOptions: { timestamps: true } })
// export class WarehouseTransfer {
//   @prop({ required: true })
//   public trans_date?: string
//   @prop({ required: true })
//   public jalur?: string
//   @prop()
//   public due_date?: string
//   @prop()
//   public unique_id!: number
//   @prop()
//   public contact_id!: number
//   @prop()
//   public amount!: number
//   @prop()
//   public ref_transaksi!: string
//   @prop()
//   public down_payment!: number
//   @prop()
//   public reason_id!: string
//   @prop()
//   public sales_id?: number | null

//   @prop()
//   public status_id!: number

//   @prop()
//   public due!: number
//   @prop()
//   public include_tax!: number
//   //
//   @prop()
//   public term_id!: number

//   @prop()
//   public ref_number!: string
//   @prop()
//   public externalId!: number
//   @prop()
//   public memo?: string

//   @prop()
//   public attachment!: any[]

//   @prop({ type: () => [Item], required: true })
//   public items!: Item[]

//   @prop()
//   public witholdings!: Witholding[]

//   @prop()
//   public contacts!: Contact[]
//   @prop({ type: () => [Warehouses], required: true })
//   public warehouses!: Warehouses[]

//   @prop({ required: true })
//   public warehouse_id?: number

//   @prop()
//   public message?: string

//   @prop()
//   public tages!: Tages[]

//   @prop()
//   public witholding_percent!: number

//   @prop()
//   public witholding_amount!: number

//   @prop()
//   public witholding_account_id!: number
// }

// class Item {
//   @prop({ required: true })
//   public finance_account_id!: number
//   @prop()
//   public name!: string

//   @prop({ required: true })
//   public qty!: number
//   @prop({ required: true })
//   public qty_update!: number

//   @prop({ required: true })
//   public price!: number

//   @prop()
//   public amount!: number

//   @prop()
//   public discount_percent!: number

//   @prop()
//   public discount_amount!: number
//   @prop()
//   public unit_id!: number
//   @prop()
//   public satuan!: string
// }

// class Witholding {
//   @prop()
//   public witholding_account_id!: number
//   @prop()
//   public down_payment!: number
//   @prop()
//   public name!: string
//   @prop()
//   public witholding_amount!: number

//   @prop()
//   public witholding_percent!: number
// }
// class Contact {
//   @prop()
//   public id!: number

//   @prop()
//   public name!: string
// }
// class Warehouses {
//   @prop({ required: true })
//   public warehouse_id!: number

//   @prop({ required: true })
//   public name!: string
// }
// class Tages {
//   @prop({ required: true })
//   public id!: number

//   @prop({ required: true })
//   public name!: string
// }

// export const WarehouseTransferModel = getModelForClass(WarehouseTransfer)
;<></>

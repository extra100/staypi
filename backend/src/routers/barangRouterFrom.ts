import axios from 'axios'
import express, { NextFunction, Request, Response } from 'express'
import expressAsyncHandler from 'express-async-handler'
import asyncHandler from 'express-async-handler'
import NodeCache from 'node-cache'
import { HOST } from '../config'
import { BarangModel } from '../models/barangModel'
import TOKEN from '../token'

type Unit = {
  id: number
  name: string
}
type Bende = {
  id: number
  name: string
  price: number
  unit_id: number
  unit: Unit
  pos_product_category_id: number
}

const barangRouter = express.Router()
const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchTags = async (page: number, perPage: number) => {
  try {
    const response = await axios.get(
      `${HOST}/finance/products?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch barangs')
    }

    const rawData = response.data.data.data
    const filteredData: Bende[] = rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      unit_id: item.unit_id,
      unit: {
        id: item.unit.id,
        name: item.unit.name,
      },
      pos_product_category_id: item.pos_product_category_id,
    }))
    console.log({ filteredData })
    console.log({ rawData })
    return {
      data: filteredData,
      total: response.data.data.total,
    }
  } catch (error) {
    console.error('Error fetching barangs by page:', error)
    throw new Error('Failed to fetch barangs by page')
  }
}

const fetchAllTags = async (perPage: number): Promise<Bende[]> => {
  const cachedData = cache.get<Bende[]>('allTages')
  if (cachedData) {
    console.log('Fetching data from cache...')
    return cachedData
  }

  let allTages: Bende[] = []
  let page = 1

  const firstPageData = await fetchTags(page, perPage)
  const totalTags = firstPageData.total
  allTages = firstPageData.data
  const totalPages = Math.ceil(totalTags / perPage)

  const batchSize = 5
  for (let i = 2; i <= totalPages; i += batchSize) {
    const requests = []
    for (let j = i; j < i + batchSize && j <= totalPages; j++) {
      requests.push(fetchTags(j, perPage))
    }

    const results = await Promise.all(requests)
    results.forEach((result) => {
      allTages = allTages.concat(result.data)
    })
  }

  cache.set('allTages', allTages)
  console.log('Data cached successfully.')

  return allTages
}
barangRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await BarangModel.create(posData)
    res.status(201).json(justPos)
  })
)

barangRouter.get(
  '/barangs',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perPage = parseInt(req.query.per_page as string) || 15

      const allTages = await fetchAllTags(perPage)

      res.json({
        success: true,
        data: allTages,
        meta: {
          total: allTages.length,
        },
      })
    } catch (error) {
      console.error('Error fetching all barangs:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

export default barangRouter

// import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'
// @modelOptions({ schemaOptions: { timestamps: true } })
// export class Barang {
//   public _id?: string
//   @prop({ required: true })
//   public id!: number
//   @prop({ required: true, unique: true })
//   public name!: string
//   @prop({ required: true, unique: true })
//   public price!: number
//   @prop({ required: true, unique: true })
//   public unit_id!: number
//   @prop({ required: true, unique: true })
//   public unit?: {
//     id: number
//     name: string
//   }
// }
// export const BarangModel = getModelForClass(Barang)

// export const useGetBarangsQuery = () =>
//   useQuery({
//     queryKey: ['barangs'],
//     queryFn: async () => {
//       try {
//         const response = await apiClient.get<{
//           data: {
//             id: number
//             name: string
//             price: number
//             unit_id: number
//             unit: { id: number; name: string } // Ensure the API response has the unit
//           }[]
//           meta: { total: number }
//         }>('/api/barangs/barangs')

//         return response.data.data
//       } catch (error) {
//         console.error('Error fetching barangs:', error)
//         throw error
//       }
//     },
//   })
// export const useGetThenAddBarangsQuery = (batchSize: number, offset: number) =>
//   useQuery({
//     queryKey: ['barangs', batchSize, offset],
//     queryFn: async () => {
//       try {
//         const response = await apiClient.get<{
//           data: {
//             id: number
//             name: string
//             price: number
//             unit_id: number
//             unit?: { id: number; name: string }
//           }[]
//           meta: { total: number }
//         }>(`/api/barangs/barangs?limit=${batchSize}&offset=${offset}`)

//         // Mengembalikan data yang telah difilter dengan tipe Barang
//         return response.data.data.map((item) => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           unit_id: item.unit_id,
//           unit: item.unit, // Menyalin data unit dari API jika ada
//         }))
//       } catch (error) {
//         console.error('Error fetching barangs:', error)
//         throw error
//       }
//     },
//   })

// export const useAddBarang = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (warehouse: Barang) => {
//       return apiClient.post<Barang>(`/api/barangs`, warehouse)
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['barangs'])
//       },
//     }
//   )
// }

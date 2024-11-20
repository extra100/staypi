import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import NodeCache from 'node-cache'
import { HOST } from '../config'
import expressAsyncHandler from 'express-async-handler'

import TOKEN from '../token'
import asyncHandler from 'express-async-handler'
import { BarangModel } from '../models/barangModel'
export interface Unit {
  id: number
  name: string
}

export interface Barang {
  id: number
  name: string
  price: number
  unit?: Unit
  pos_product_category_id: number
}
const barangTetukRouter = express.Router()

barangTetukRouter.get(
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

const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchBarangs = async (page: number, perPage: number) => {
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
    const filteredData: Barang[] = rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      pos_product_category_id: item.pos_product_category_id,
      unit: item.unit
        ? {
            id: item.unit.id,
            name: item.unit.name,
          }
        : { id: 0, name: 'Unknown' },
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

const fetchAllBarangs = async (perPage: number): Promise<Barang[]> => {
  const cachedData = cache.get<Barang[]>('allBaranges')
  if (cachedData) {
    console.log('Fetching data from cache...')
    return cachedData
  }

  let allBaranges: Barang[] = []
  let page = 1

  const firstPageData = await fetchBarangs(page, perPage)
  const totalBarangs = firstPageData.total
  allBaranges = firstPageData.data
  const totalPages = Math.ceil(totalBarangs / perPage)

  const batchSize = 5
  for (let i = 2; i <= totalPages; i += batchSize) {
    const requests = []
    for (let j = i; j < i + batchSize && j <= totalPages; j++) {
      requests.push(fetchBarangs(j, perPage))
    }

    const results = await Promise.all(requests)
    results.forEach((result) => {
      allBaranges = allBaranges.concat(result.data)
    })
  }

  cache.set('allBaranges', allBaranges)
  console.log('Data cached successfully.')

  return allBaranges
}
barangTetukRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await BarangModel.create(posData)
    res.status(201).json(justPos)
  })
)

barangTetukRouter.get(
  '/barangs',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perPage = parseInt(req.query.per_page as string) || 15

      const allBaranges = await fetchAllBarangs(perPage)

      res.json({
        success: true,
        data: allBaranges,
        meta: {
          total: allBaranges.length,
        },
      })
    } catch (error) {
      console.error('Error fetching all barangs:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

export default barangTetukRouter

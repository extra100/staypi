import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import NodeCache from 'node-cache' // Import caching library
import { HOST } from '../config'
import expressAsyncHandler from 'express-async-handler'
import { WarehousesGetDb } from '../models/warehousesDb'
import TOKEN from '../token'

type Warehouse = {
  id: number
  name: string
  code: string
}

const warehouseRouter = express.Router()
const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchWarehousesByPage = async (page: number, perPage: number) => {
  try {
    const response = await axios.get(
      `${HOST}/finance/warehouses?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch warehouses')
    }

    const rawData = response.data.data.data
    const filteredData: Warehouse[] = rawData.map((warehouse: any) => ({
      id: warehouse.id,
      name: warehouse.name,
      code: warehouse.code,
    }))
    console.log({ filteredData })
    console.log({ rawData })
    return {
      data: filteredData,
      total: response.data.data.total,
    }
  } catch (error) {
    console.error('Error fetching warehouses by page:', error)
    throw new Error('Failed to fetch warehouses by page')
  }
}

const fetchAllWarehouses = async (perPage: number): Promise<Warehouse[]> => {
  const cachedData = cache.get<Warehouse[]>('allWarehouses')
  if (cachedData) {
    console.log('Fetching data from cache...')
    return cachedData
  }

  let allWarehouses: Warehouse[] = []
  let page = 1

  const firstPageData = await fetchWarehousesByPage(page, perPage)
  const totalWarehouses = firstPageData.total
  allWarehouses = firstPageData.data
  const totalPages = Math.ceil(totalWarehouses / perPage)

  const batchSize = 5
  for (let i = 2; i <= totalPages; i += batchSize) {
    const requests = []
    for (let j = i; j < i + batchSize && j <= totalPages; j++) {
      requests.push(fetchWarehousesByPage(j, perPage))
    }

    const results = await Promise.all(requests)
    results.forEach((result) => {
      allWarehouses = allWarehouses.concat(result.data)
    })
  }

  cache.set('allWarehouses', allWarehouses)
  console.log('Data cached successfully.')

  return allWarehouses
}

warehouseRouter.get(
  '/warehouses',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perPage = parseInt(req.query.per_page as string) || 15

      const allWarehouses = await fetchAllWarehouses(perPage)

      res.json({
        success: true,
        data: allWarehouses,
        meta: {
          total: allWarehouses.length,
        },
      })
    } catch (error) {
      console.error('Error fetching all warehouses:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)
warehouseRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await WarehousesGetDb.create(posData)
    res.status(201).json(justPos)
  })
)

export default warehouseRouter

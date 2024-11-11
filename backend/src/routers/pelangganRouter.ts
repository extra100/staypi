import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import NodeCache from 'node-cache'
import { HOST } from '../config'
import expressAsyncHandler from 'express-async-handler'

import TOKEN from '../token'
import asyncHandler from 'express-async-handler'
import { PelangganModel } from '../models/PelangganModel'
// type any = {
//   id: number
//   name: string
//   group_id: number
//   phone: string
//   address: string
//   group?: {
//     id: number
//     name: string
//   }
// }
const pelangganRouter = express.Router()

pelangganRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const pelanggans = await PelangganModel.find()
      res.json(pelanggans)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchPelanggans = async (page: number, perPage: number) => {
  try {
    const response = await axios.get(
      `${HOST}/finance/contacts?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch pelanggans')
    }

    const rawData = response.data.data.data
    const filteredData: any[] = rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
      phone: item.phone || 'Mohon Lengkapi No Tlpn', // Set a default if missing
      address: item.address || 'Mohon Lengkpai Alamat', // Set a default if missing
      group_id: item.group_id ?? 0,
      group: item.group
        ? { id: item.group.id, name: item.group.name }
        : undefined,
    }))
    console.log({ filteredData })

    return {
      data: filteredData,
      total: response.data.data.total,
    }
  } catch (error) {
    console.error('Error fetching pelanggans by page:', error)
    throw new Error('Failed to fetch pelanggans by page')
  }
}

const fetchAllPelanggans = async (perPage: number): Promise<any[]> => {
  const cachedData = cache.get<any[]>('allPelangganes')
  if (cachedData) {
    console.log('Fetching data from cache...')
    return cachedData
  }

  let allPelangganes: any[] = []
  let page = 1

  const firstPageData = await fetchPelanggans(page, perPage)
  const totalPelanggans = firstPageData.total
  allPelangganes = firstPageData.data
  const totalPages = Math.ceil(totalPelanggans / perPage)

  const batchSize = 5
  for (let i = 2; i <= totalPages; i += batchSize) {
    const requests = []
    for (let j = i; j < i + batchSize && j <= totalPages; j++) {
      requests.push(fetchPelanggans(j, perPage))
    }

    const results = await Promise.all(requests)
    results.forEach((result) => {
      allPelangganes = allPelangganes.concat(result.data)
    })
  }

  cache.set('allPelangganes', allPelangganes)
  console.log('Data cached successfully.')

  return allPelangganes
}
pelangganRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = {
      id: req.body.id,
      name: req.body.name,
      phone: req.body.phone || 'Mohon Lengkapi No Tlpn', // Default if missing
      address: req.body.address || 'Mohon Lengkapi Alamat', // Default if missing
      group_id: req.body.group_id ?? 0,
      group: req.body.group
        ? { id: req.body.group.id, name: req.body.group.name }
        : undefined,
    }

    try {
      const justPos = await PelangganModel.create(posData)
      res.status(201).json(justPos)
    } catch (error) {
      console.error('Error creating contact:', error)
      res.status(500).json({ message: 'Error creating contact', error })
    }
  })
)

pelangganRouter.get(
  '/pelanggans',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perPage = parseInt(req.query.per_page as string) || 15

      const allPelangganes = await fetchAllPelanggans(perPage)

      res.json({
        success: true,
        data: allPelangganes,
        meta: {
          total: allPelangganes.length,
        },
      })
    } catch (error) {
      console.error('Error fetching all pelanggans:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

export default pelangganRouter

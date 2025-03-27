import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import NodeCache from 'node-cache'
import { HOST } from '../config'
import expressAsyncHandler from 'express-async-handler'
import { AkunBankModel } from '../models/akunBankModel'
import TOKEN from '../token'
import asyncHandler from 'express-async-handler'
type AkunBank = {
  id: number
  name: string
}

const akunBankRouter = express.Router()

akunBankRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const akunBanks = await AkunBankModel.find()
      res.json(akunBanks)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchAkunBanks = async (page: number, perPage: number) => {
  try {
    const response = await axios.get(
      `${HOST}/finance/accounts?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch akunBanks')
    }

    const rawData = response.data.data.data
    const filteredData: AkunBank[] = rawData.map((item: any) => ({
      id: item.id,
      name: item.name,
    }))
    console.log({ filteredData })
    console.log({ rawData })
    return {
      data: filteredData,
      total: response.data.data.total,
    }
  } catch (error) {
    console.error('Error fetching akunBanks by page:', error)
    throw new Error('Failed to fetch akunBanks by page')
  }
}

const fetchAllAkunBanks = async (perPage: number): Promise<AkunBank[]> => {
  const cachedData = cache.get<AkunBank[]>('allAkunBanks')
  if (cachedData) {
    console.log('Fetching data from cache...')
    return cachedData
  }

  let allAkunBanks: AkunBank[] = []
  let page = 1

  const firstPageData = await fetchAkunBanks(page, perPage)
  const totalAkunBanks = firstPageData.total
  allAkunBanks = firstPageData.data
  const totalPages = Math.ceil(totalAkunBanks / perPage)

  const batchSize = 5
  for (let i = 2; i <= totalPages; i += batchSize) {
    const requests = []
    for (let j = i; j < i + batchSize && j <= totalPages; j++) {
      requests.push(fetchAkunBanks(j, perPage))
    }

    const results = await Promise.all(requests)
    results.forEach((result) => {
      allAkunBanks = allAkunBanks.concat(result.data)
    })
  }

  cache.set('allAkunBanks', allAkunBanks)
  console.log('Data cached successfully.')

  return allAkunBanks
}
akunBankRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await AkunBankModel.create(posData)
    res.status(201).json(justPos)
  })
)

akunBankRouter.get(
  '/akunBanks',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perPage = parseInt(req.query.per_page as string) || 15

      const allAkunBanks = await fetchAllAkunBanks(perPage)

      res.json({
        success: true,
        data: allAkunBanks,
        meta: {
          total: allAkunBanks.length,
        },
      })
    } catch (error) {
      console.error('Error fetching all akunBanks:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

export default akunBankRouter

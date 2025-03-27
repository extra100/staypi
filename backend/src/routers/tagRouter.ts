import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import NodeCache from 'node-cache'
import { HOST } from '../config'
import expressAsyncHandler from 'express-async-handler'
import { TagModel } from '../models/tagModel'
import TOKEN from '../token'
import asyncHandler from 'express-async-handler'
type Tag = {
  id: number
  name: string
}

const tagRouter = express.Router()

tagRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const tags = await TagModel.find()
      res.json(tags)
    } catch (error) {
      console.error('Server Error:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })
)

const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchTags = async (page: number, perPage: number) => {
  try {
    const response = await axios.get(
      `${HOST}/finance/tags?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to fetch tags')
    }

    const rawData = response.data.data.data
    const filteredData: Tag[] = rawData.map((item: any) => ({
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
    console.error('Error fetching tags by page:', error)
    throw new Error('Failed to fetch tags by page')
  }
}

const fetchAllTags = async (perPage: number): Promise<Tag[]> => {
  const cachedData = cache.get<Tag[]>('allTages')
  if (cachedData) {
    console.log('Fetching data from cache...')
    return cachedData
  }

  let allTages: Tag[] = []
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
tagRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await TagModel.create(posData)
    res.status(201).json(justPos)
  })
)

tagRouter.get(
  '/tags',
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
      console.error('Error fetching all tags:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

export default tagRouter

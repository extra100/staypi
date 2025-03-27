import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import NodeCache from 'node-cache' // Import caching library
import { HOST } from '../config'
import expressAsyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'
import TOKEN from '../token'

type Product = {
  id: number
  name: string
  price: number
}

const productRouter = express.Router()
const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchProductsByPage = async (page: number, perPage: number) => {
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
      throw new Error('Failed to fetch products')
    }

    const rawData = response.data.data.data
    const filteredData: Product[] = rawData.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
    }))
    console.log({ filteredData })
    console.log({ rawData })
    return {
      data: filteredData,
      total: response.data.data.total,
    }
  } catch (error) {
    console.error('Error fetching products by page:', error)
    throw new Error('Failed to fetch products by page')
  }
}

const fetchAllProducts = async (perPage: number): Promise<Product[]> => {
  const cachedData = cache.get<Product[]>('allProducts')
  if (cachedData) {
    console.log('Fetching data from cache...')
    return cachedData
  }

  let allProducts: Product[] = []
  let page = 1

  const firstPageData = await fetchProductsByPage(page, perPage)
  const totalProducts = firstPageData.total
  allProducts = firstPageData.data
  const totalPages = Math.ceil(totalProducts / perPage)

  const batchSize = 5
  for (let i = 2; i <= totalPages; i += batchSize) {
    const requests = []
    for (let j = i; j < i + batchSize && j <= totalPages; j++) {
      requests.push(fetchProductsByPage(j, perPage))
    }

    const results = await Promise.all(requests)
    results.forEach((result) => {
      allProducts = allProducts.concat(result.data)
    })
  }

  cache.set('allProducts', allProducts)
  console.log('Data cached successfully.')

  return allProducts
}
productRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = req.body

    const justPos = await ProductModel.create(posData)
    res.status(201).json(justPos)
  })
)

productRouter.get(
  '/products',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const perPage = parseInt(req.query.per_page as string) || 15

      const allProducts = await fetchAllProducts(perPage)

      res.json({
        success: true,
        data: allProducts,
        meta: {
          total: allProducts.length,
        },
      })
    } catch (error) {
      console.error('Error fetching all products:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)

export default productRouter

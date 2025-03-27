import express, { Request, Response, NextFunction } from 'express'
import NodeCache from 'node-cache'
import expressAsyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'

type Product = {
  id: number
  name: string
  base_price: number
}

const productRouter = express.Router()
const cache = new NodeCache({ stdTTL: 10000000000000000 })

const fetchProductsByPage = async (page: number, perPage: number) => {
  try {
    const skip = (page - 1) * perPage
    const products = await ProductModel.find({}).skip(skip).limit(perPage)

    const totalProducts = await ProductModel.countDocuments()

    const filteredData: Product[] = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      base_price: product.base_price,
    }))

    return {
      data: filteredData,
      total: totalProducts,
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
  //
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

// Endpoint untuk mendapatkan semua produk
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

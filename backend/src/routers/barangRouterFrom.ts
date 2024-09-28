// import express, { Request, Response, NextFunction } from 'express'
// import NodeCache from 'node-cache'
// import expressAsyncHandler from 'express-async-handler'

// import { BarangModel } from '../models/barangModel'

// type Barang = {
//   id: number
//   name: string
//   price: number
// }

// const barangRouterFrom = express.Router()
// const cache = new NodeCache({ stdTTL: 10000000000000000 })

// const fetchProductsByPage = async (page: number, perPage: number) => {
//   try {
//     const skip = (page - 1) * perPage
//     const barangs = await BarangModel.find({}).skip(skip).limit(perPage)

//     const totalProducts = await BarangModel.countDocuments()

//     const filteredData: Barang[] = barangs.map((product: any) => ({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//     }))

//     return {
//       data: filteredData,
//       total: totalProducts,
//     }
//   } catch (error) {
//     console.error('Error fetching barangs by page:', error)
//     throw new Error('Failed to fetch barangs by page')
//   }
// }

// const fetchAllProducts = async (perPage: number): Promise<Barang[]> => {
//   const cachedData = cache.get<Barang[]>('allProducts')
//   if (cachedData) {
//     console.log('Fetching data from cache...')
//     return cachedData
//   }

//   let allProducts: Barang[] = []
//   let page = 1

//   const firstPageData = await fetchProductsByPage(page, perPage)
//   const totalProducts = firstPageData.total
//   allProducts = firstPageData.data
//   const totalPages = Math.ceil(totalProducts / perPage)

//   const batchSize = 5
//   for (let i = 2; i <= totalPages; i += batchSize) {
//     const requests = []
//     for (let j = i; j < i + batchSize && j <= totalPages; j++) {
//       requests.push(fetchProductsByPage(j, perPage))
//     }

//     const results = await Promise.all(requests)
//     results.forEach((result) => {
//       allProducts = allProducts.concat(result.data)
//     })
//   }

//   cache.set('allProducts', allProducts)
//   console.log('Data cached successfully.')

//   return allProducts
// }
// barangRouterFrom.post(
//   '/',
//   expressAsyncHandler(async (req, res) => {
//     const posData = req.body

//     const justPos = await BarangModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )

// barangRouterFrom.get(
//   '/barangs',
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const perPage = parseInt(req.query.per_page as string) || 15

//       const allProducts = await fetchAllProducts(perPage)

//       res.json({
//         success: true,
//         data: allProducts,
//         meta: {
//           total: allProducts.length,
//         },
//       })
//     } catch (error) {
//       console.error('Error fetching all barangs:', error)
//       res.status(500).json({ error: 'Internal Server Error' })
//     }
//   }
// )

// export default barangRouterFrom

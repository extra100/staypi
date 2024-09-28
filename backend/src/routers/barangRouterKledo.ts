// import express, { Request, Response, NextFunction } from 'express'
// import axios from 'axios'
// import NodeCache from 'node-cache' // Import caching library
// import { HOST } from '../config'
// import expressAsyncHandler from 'express-async-handler'
// import { BarangModel } from '../models/barangModel'

// type Barang = {
//   id: number
//   name: string
//   price: number
// }

// const barangRouterKledo = express.Router()
// const cache = new NodeCache({ stdTTL: 10000000000000000 })

// const fetchBarangsByPage = async (page: number, perPage: number) => {
//   try {
//     const response = await axios.get(
//       `${HOST}/finance/products?page=${page}&per_page=${perPage}`,
//       {
//         headers: {
//           Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MmQ2MzFiMC0wZDFjLTQzNWItOGZkYS0yYWI4YmE2YzVkM2EiLCJqdGkiOiIxMjQ3OTU4MzExMDE4NGVkYTIxMzkwMzYyMzNhMGEyZjI2ODE5MjcyMTNlN2QwZGZkM2M2OTQzYmJlMjg3ZGVjZmFlMDc0YmRhNDJlZTRiNyIsImlhdCI6MTcyNTg1NTQ2MS43OTYwNzgsIm5iZiI6MTcyNTg1NTQ2MS43OTYwODIsImV4cCI6MTcyODQ0NzQ2MS43ODQzNzIsInN1YiI6IjE5NDYyNyIsInNjb3BlcyI6WyJ3ZWIiLCJmaW5hbmNlIl19.mKmUzBRjo4GieuE8s1tQeWQebRNLHMRDj2bGmQpsoUW_gWVHxEuRSqpBYz0k0-m2xx4daoVTePH2dv5kS4CFwhGpPEP4r0_neYjsBw7OBSK2_T13nv7HTvLIvD1zakTggKG3W8vYwTn4q2aqyIOes3saivC_8PV7ELDxk21Cs2nGIDUGcM2sxnIhOHkKnhb2qfokBabLPvk4NC2fc5iB4PNlakKHGcKhf5uu06oVah4za7mGhbu-S8jlQqYW9453dXflAEaQpcxl4jIxtjiBazp0sr79B9GiSo_0bp4qhYGq1dpc49YXm1bQmz5ZdaxuZHXpivrZ0a0l8fLnstXHhnikXDb6BGpZzB6w23ncwiQO-eENmVvJ0FIqbFnUZdnnNZvmUzbPQ8_nFNiBd5wnJMlrCkvzIJXYJjSSHgRMR_LIQA-KmW-bEPZy2nLytAj34nOUeVmMOalkoZf90goL--hFV69esHpV_h8NlS4hmJ3P_Ns-cl4kCBIMg0FWKNx4JEpHMjslaVvB0b8UqccJ2U_cBj5OuStVFm6NC4JLkcNIuv1iDkVKhFP_qsH3J-FbTOpV5Kp87M70cDKH1SsUJZDEpj0lf-9r6fSx8DpNEh3OH8RGq-dP-pQq6QPCRbzEZP7JmsZYGvoKN5NRwvz2vkr1yQnLTklLzBX7wSf60F0`,
//         },
//       }
//     )
//     if (response.status !== 200) {
//       throw new Error('Failed to fetch barangs')
//     }

//     const rawData = response.data.data.data
//     const filteredData: Barang[] = rawData.map((product: any) => ({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//     }))
//     console.log({ filteredData })
//     console.log({ rawData })
//     return {
//       data: filteredData,
//       total: response.data.data.total,
//     }
//   } catch (error) {
//     console.error('Error fetching barangs by page:', error)
//     throw new Error('Failed to fetch barangs by page')
//   }
// }

// const fetchAllBarangs = async (perPage: number): Promise<Barang[]> => {
//   const cachedData = cache.get<Barang[]>('allBarangs')
//   if (cachedData) {
//     console.log('Fetching data from cache...')
//     return cachedData
//   }

//   let allBarangs: Barang[] = []
//   let page = 1

//   const firstPageData = await fetchBarangsByPage(page, perPage)
//   const totalBarangs = firstPageData.total
//   allBarangs = firstPageData.data
//   const totalPages = Math.ceil(totalBarangs / perPage)

//   const batchSize = 5
//   for (let i = 2; i <= totalPages; i += batchSize) {
//     const requests = []
//     for (let j = i; j < i + batchSize && j <= totalPages; j++) {
//       requests.push(fetchBarangsByPage(j, perPage))
//     }

//     const results = await Promise.all(requests)
//     results.forEach((result) => {
//       allBarangs = allBarangs.concat(result.data)
//     })
//   }

//   cache.set('allBarangs', allBarangs)
//   console.log('Data cached successfully.')

//   return allBarangs
// }

// barangRouterKledo.get(
//   '/barangs',
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const perPage = parseInt(req.query.per_page as string) || 15

//       const allBarangs = await fetchAllBarangs(perPage)

//       res.json({
//         success: true,
//         data: allBarangs,
//         meta: {
//           total: allBarangs.length,
//         },
//       })
//     } catch (error) {
//       console.error('Error fetching all barangs:', error)
//       res.status(500).json({ error: 'Internal Server Error' })
//     }
//   }
// )
// barangRouterKledo.post(
//   '/',
//   expressAsyncHandler(async (req, res) => {
//     const posData = req.body

//     const justPos = await BarangModel.create(posData)
//     res.status(201).json(justPos)
//   })
// )

// barangRouterKledo.get(
//   '/barangs',
//   expressAsyncHandler(async (req: Request, res: Response) => {
//     const bebas = await BarangModel.find({})
//     res.json(bebas)
//   })
// )

// export default barangRouterKledo

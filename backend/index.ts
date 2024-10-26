import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import akunBankRouter from './src/routers/akunBankRouter'
import { barangRouter } from './src/routers/barangRouter'
import barangTerjualRouter from './src/routers/barangTerjualRouter'
// import barangRouter from './routers/barangRouter'

import { contactRouter } from './src/routers/contactRouter'

import { keyRouter } from './src/routers/keyRouter'
import { orderRouter } from './src/routers/orderRouter'
import outletRouter from './src/routers/outletRouter'
import perhitunganRouter from './src/routers/perthitunganRouter'
import warehouseTransferRouter from './src/routers/pindahRouter'
import productRouter from './src/routers/productRouter'
import { returnRouter } from './src/routers/returnRouter'
import soldBarangRouter from './src/routers/soldBarangRouter'
import tagRouter from './src/routers/tagRouter'
import transactionRouter from './src/routers/transactionRouter'
import transaksiPolosanRouter from './src/routers/transaksiPolosanRouter'
import { userRouter } from './src/routers/userRouter'
import warehouseRouter from './src/routers/warehousesRouter'

dotenv.config()
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/tsmernamazonadb'
mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

const app = express()
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
  })
)

app.use(express.json({ limit: '200mb' })) // Set payload limit for JSON requests
app.use(express.urlencoded({ extended: true, limit: '200mb' })) // Set payload limit for URL-encoded data

app.use('/api/products', productRouter)
app.use('/api/warehouses', warehouseRouter)
app.use('/api/tags', tagRouter)
app.use('/api/akunbanks', akunBankRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/barangs', barangRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/returns', returnRouter)
app.use('/api/pindah', warehouseTransferRouter)

app.use('/api/transaksipolosans', transaksiPolosanRouter)

app.use('/api/sold-barang', soldBarangRouter)

app.use('/api/users', userRouter)
app.use('/api/outlets', outletRouter)
app.use('/api/orders', orderRouter)

app.use('/api/keys', keyRouter)
// app.use('/api/pindah', warehouseTransferRouter)
app.use('/api/barters', barangTerjualRouter)
app.use('/api/perhitungans', perhitunganRouter)

console.log(path.join(__dirname, 'frontend/dist'))

// app.use(express.static(path.join(__dirname, '../../frontend/dist')))
// app.get('*', (req: Request, res: Response) =>
//   res.sendFile(path.join(__dirname, '../../frontend/index.html'))
// )

app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})

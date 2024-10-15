import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import akunBankRouter from './routers/akunBankRouter'
import { barangRouter } from './routers/barangRouter'
import barangTerjualRouter from './routers/barangTerjualRouter'
// import barangRouter from './routers/barangRouter'

import { contactRouter } from './routers/contactRouter'

import { keyRouter } from './routers/keyRouter'
import { orderRouter } from './routers/orderRouter'
import outletRouter from './routers/outletRouter'
import warehouseTransferRouter from './routers/pindahRouter'
import productRouter from './routers/productRouter'
import tagRouter from './routers/tagRouter'
import transactionRouter from './routers/transactionRouter'
import { userRouter } from './routers/userRouter'
import warehouseRouter from './routers/warehousesRouter'

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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/warehouses', warehouseRouter)
app.use('/api/tags', tagRouter)
app.use('/api/akunbanks', akunBankRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/barangs', barangRouter)
app.use('/api/transactions', transactionRouter)

app.use('/api/users', userRouter)
app.use('/api/outlets', outletRouter)
app.use('/api/orders', orderRouter)

app.use('/api/keys', keyRouter)
app.use('/api/pindah', warehouseTransferRouter)
app.use('/api/barters', barangTerjualRouter)

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

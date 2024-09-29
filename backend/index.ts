import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { barangRouter } from './src/routers/barangRouter'
// import barangRouter from './routers/barangRouter'

import { contactRouter } from './src/routers/contactRouter'

import { keyRouter } from './src/routers/keyRouter'
import { orderRouter } from './src/routers/orderRouter'
import outletRouter from './src/routers/outletRouter'
import warehouseTransferRouter from './src/routers/pindahRouter'
import productRouter from './src/routers/productRouter'
import tagRouter from './src/routers/tagRouter'
import transactionRouter from './src/routers/transactionRouter'
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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/warehouses', warehouseRouter)
app.use('/api/tags', tagRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/barangs', barangRouter)
app.use('/api/transactions', transactionRouter)

app.use('/api/users', userRouter)
app.use('/api/outlets', outletRouter)
app.use('/api/orders', orderRouter)

app.use('/api/keys', keyRouter)
app.use('/api/pindah', warehouseTransferRouter)

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

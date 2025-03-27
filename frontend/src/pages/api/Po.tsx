import { useState, useEffect } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'

export interface Stock {
  warehouse_id: number
  qty: number
  product_val: number
  avg_price: number
}

export interface ProductStock {
  id: string
  qty: number
  stocks: Record<string, Stock>
}

export interface ProductStocksResponse {
  success: boolean
  data: ProductStock[]
  message: string
  time: number
}

export function useProductStocks(
  productIds: string,
  warehouseIds: string,
  transDate?: string
) {
  const [stocks, setStocks] = useState<ProductStock[]>([])
  const [loading, setLoading] = useState(true)
  const [qtyById, setQtyById] = useState<{
    [productId: string]: { [warehouseId: string]: number }
  }>({})

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(
          `${HOST}/finance/products/stocks?product_ids=${productIds}&warehouse_ids=${warehouseIds}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch product stocks')
        }

        const stockData: ProductStocksResponse = await response.json()
        setStocks(stockData.data)

        // Update qtyById based on the fetched data
        const qtyData = stockData.data.reduce((acc, product) => {
          const warehouseQuantities = Object.entries(product.stocks).reduce(
            (stockAcc, [warehouseId, stock]) => {
              stockAcc[warehouseId] = stock.qty
              return stockAcc
            },
            {} as { [warehouseId: string]: number }
          )

          acc[product.id] = warehouseQuantities
          return acc
        }, {} as { [productId: string]: { [warehouseId: string]: number } })

        setQtyById(qtyData)
      } catch (error) {
        console.error('Error fetching stocks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, [productIds, warehouseIds, transDate])

  return { stocks, loading, qtyById }
}

import { useState, useCallback } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'

interface includedStock {
  productId: number
  productName: string
  productCode: string
  qty: number
}

interface ApiResponse {
  data: {
    current_page: number
    data: {
      id: number
      name: string
      code: string
      stock: {
        [key: number]: number
      }
      stock_total: number
    }[]
  }
}

export const useincludedStockIncludedullStok = () => {
  const [includedStock, setincludedStock] = useState<includedStock[]>([])

  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  const fetchincludedStock = useCallback(
    async (date: string, warehouseIds: number[]) => {
      setLoading(true)
      setincludedStock([])
      let currentPage = 1
      let allFetched = false
      let fetchedItems = 0

      try {
        while (!allFetched) {
          const url = `${HOST}/reportings/warehouseStock?date=${date}&warehouse_ids=${warehouseIds.join(
            ','
          )}&per_page=100&page=${currentPage}`

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          })

          if (!response.ok) {
            throw new Error('Gagal mengambil data stok gudang')
          }

          const jsonResponse: ApiResponse = await response.json()

          const formattedData: includedStock[] = jsonResponse.data.data.map(
            (item) => ({
              productId: item.id,
              productName: item.name,
              productCode: item.code,
              qty: item.stock[warehouseIds[0]] || 0, // Use stock from the first warehouse ID
            })
          )

          // Append the newly fetched data to existing data
          setincludedStock((prev) => [...prev, ...formattedData])

          // Update total items fetched
          fetchedItems += formattedData.length
          setTotalItems(fetchedItems)

          // Check if there are more pages or stop the loop if we fetched less than expected
          if (formattedData.length < 100 || fetchedItems >= 2000) {
            allFetched = true
          } else {
            currentPage += 1 // Go to the next page
          }
        }
      } catch (error) {
        console.error('Error saat mengambil data:', error)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { includedStock, loading, fetchincludedStock, totalItems }
}

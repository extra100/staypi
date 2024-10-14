import { useState, useEffect } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'
//
export interface WarehouseStock {
  id: number
  name: string
  code: string
  stock: number
  stock_total: number
}

export function useWarehouseStock(date: string, warehouseIds: number) {
  const [loading, setLoading] = useState(true)
  const [warehouseStock, setWarehouseStock] = useState<WarehouseStock[]>([])
  const cacheKey = `${date}-${warehouseIds}`
  const cache = new Map<string, WarehouseStock[]>()

  const fetchWarehousesByPage = async (page: number, perPage: number) => {
    const response = await fetch(
      `${HOST}/reportings/warehouseStock?date=${date}&warehouse_ids=${warehouseIds}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch warehouse stock')
    }

    const data = await response.json()

    return {
      data: data.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        stock: item.stock[warehouseIds] || 0,
        stock_total: item.stock_total || 0,
      })),
      total: data.data.total, // Total number of warehouses
    }
  }

  const fetchAllWarehouseStock = async (perPage: number) => {
    let allWarehouseStock: WarehouseStock[] = []
    let page = 1

    // Fetch the first page to determine total pages
    const firstPageResult = await fetchWarehousesByPage(page, perPage)
    allWarehouseStock = firstPageResult.data

    // Set the initial fetched data
    setWarehouseStock([...allWarehouseStock])

    const totalWarehouses = firstPageResult.total
    const totalPages = Math.ceil(totalWarehouses / perPage)

    // Fetch remaining pages in batches of 5
    const batchSize = 5
    for (let i = 2; i <= totalPages; i += batchSize) {
      const requests = []
      for (let j = i; j < i + batchSize && j <= totalPages; j++) {
        requests.push(fetchWarehousesByPage(j, perPage))
      }

      const results = await Promise.all(requests)
      results.forEach((result) => {
        // Append the new data as each batch is fetched
        allWarehouseStock = allWarehouseStock.concat(result.data)
        setWarehouseStock((prevStock) => [...prevStock, ...result.data])
      })
    }

    return allWarehouseStock
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Check if data is cached
      if (cache.has(cacheKey)) {
        setWarehouseStock(cache.get(cacheKey) || [])
        setLoading(false)
        return
      }

      try {
        const perPage = 200 // Fetch 200 records per page
        const allWarehouseStock = await fetchAllWarehouseStock(perPage)

        // Cache the result
        cache.set(cacheKey, allWarehouseStock)
      } catch (error) {
        console.error('Error fetching warehouse stock:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [date, warehouseIds])

  return { warehouseStock }
}

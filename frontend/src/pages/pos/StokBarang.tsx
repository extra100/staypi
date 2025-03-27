import { useState, useEffect } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

interface propertyStokBarang {
  productId: string
  warehouseId: number
  qty: number
  avg_price: number
}

export const useStokBarang = () => {
  const [dataStokBarang, setDataStokBarang] =
    useState<propertyStokBarang | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStokBarang = async (productId: string, warehouseId: number) => {
    setLoading(false)
    try {
      const tokenResponse = await fetch(`${HOST}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'client_credentials',
        }),
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch access token')
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      const url = `${HOST}/finance/products/stocks?product_ids=${productId}&warehouse_ids=${warehouseId}`

      const productResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })

      if (!productResponse.ok) {
        throw new Error('Failed to fetch product data')
      }

      const { data } = await productResponse.json()
      const formattedData = data.map((item: any) => ({
        productId: item.id,
        warehouseId: item.stocks[warehouseId].warehouse_id,
        qty: item.stocks[warehouseId].qty,
        avg_price: item.stocks[warehouseId].avg_price,
      }))[0]

      setDataStokBarang(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(true)
    }
  }

  return { dataStokBarang, loading, fetchStokBarang }
}

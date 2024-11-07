import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Unit {
  id: number
  name: string
}

export interface Barang {
  id: number
  name: string
  price: number
  unit?: Unit
}

export function useIdNamaddBarang() {
  const [loading, setLoading] = useState(true)
  const [idDataddBarang, setIdDataddBarang] = useState<Barang[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('ddBarangTransactions')
        if (storedData) {
          setIdDataddBarang(JSON.parse(storedData))
          setLoading(false)
          return
        }

        const response = await fetch(`${HOST}/oauth/token`, {
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

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        const accessToken = data.access_token

        const bankTransResponse = await fetch(
          `${HOST}/finance/products?page=1&per_page=2000`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!bankTransResponse.ok) {
          throw new Error('Failed to fetch bank transactions')
        }

        const bankTransData = await bankTransResponse.json()
        const formattedData: Barang[] = bankTransData.data.data.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            unit: item.unit
              ? {
                  id: item.unit.id,
                  name: item.unit.name,
                }
              : { id: 0, name: 'Unknown' },
          })
        )

        setIdDataddBarang(formattedData)
        sessionStorage.setItem(
          'ddBarangTransactions',
          JSON.stringify(formattedData)
        )
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const memoizedData = useMemo(() => idDataddBarang, [idDataddBarang])

  return { loading, idDataddBarang }
}

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

export function useIdNamaBarang() {
  const [loading, setLoading] = useState(true)
  const [idaDataBarang, setIdNamaBarang] = useState<Barang[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('Barangs')
        if (storedData) {
          setIdNamaBarang(JSON.parse(storedData))
          setLoading(false)
          return
        }

        let allBarangs: Barang[] = []
        let page = 1
        let hasMoreData = true

        while (hasMoreData) {
          const barangTransRspon = await fetch(
            `${HOST}/finance/products?page=${page}&per_page=200`,
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          )

          if (!barangTransRspon.ok) {
            throw new Error('Failed to fetch bank transactions')
          }

          const dataBarang = await barangTransRspon.json()
          const formattedData: Barang[] = dataBarang.data.data.map(
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
          allBarangs = [...allBarangs, ...formattedData]

          if (dataBarang.data.data.length < 200) {
            hasMoreData = false
          } else {
            page++
          }
        }

        setIdNamaBarang(allBarangs)
        sessionStorage.setItem('Barangs', JSON.stringify(allBarangs))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const memoizedData = useMemo(() => idaDataBarang, [idaDataBarang])

  return { loading, idaDataBarang }
}

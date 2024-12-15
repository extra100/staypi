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
  code: string
  pos_product_category_id: number
}

export function searchBasedNamaBarang(searchTerm: string = '') {
  const [loading, setLoading] = useState(true)
  const [namaBarang, setNamaBarang] = useState<Barang[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!searchTerm) {
          setNamaBarang([])
          setLoading(false)
          return
        }

        const url = new URL(`${HOST}/finance/products`)
        url.searchParams.append('search', searchTerm) // No double encoding

        const barangTransRspon = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })

        if (!barangTransRspon.ok) {
          throw new Error('Failed to fetch barang data')
        }

        const dataBarang = await barangTransRspon.json()
        const formattedData: Barang[] = dataBarang.data.data.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            code: item.code,
            pos_product_category_id: item.pos_product_category_id || 0,
          })
        )

        setNamaBarang(formattedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm])

  return { loading, namaBarang }
}

import { group } from 'console'
import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface group {
  id: number
  name: string
}

export interface Pelanggan {
  id: number
  name: string
  group_id: number
  phone: string
  address: string
  group?: group
}

export function searchBasedNamaPelanggan(searchTerm: string = '') {
  const [loading, setLoading] = useState(true)
  const [namaPelanggan, setNamaPelanggan] = useState<Pelanggan[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!searchTerm) {
          setNamaPelanggan([])
          setLoading(false)
          return
        }

        const url = new URL(`${HOST}/finance/contacts`)
        url.searchParams.append('search', searchTerm) // No double encoding

        const pelangganTransResp = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })

        if (!pelangganTransResp.ok) {
          throw new Error('Failed to fetch pelanggan data')
        }

        const dataPelanggan = await pelangganTransResp.json()
        const formattedData: Pelanggan[] = dataPelanggan.data.data.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            group_id: item.group_id,
            phone: item.phone,
            address: item.address,
            group: item.group || 0,
          })
        )

        setNamaPelanggan(formattedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm])

  return { loading, namaPelanggan }
}

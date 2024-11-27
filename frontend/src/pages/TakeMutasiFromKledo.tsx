import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../config'
import TOKEN from '../token'

export interface Invoice {
  id: number
  ref_number: string
  status_id: number
  from_warehouse_id: number
  qty: number
  memo: string
  to_warehouse_id: number
}

export function TakeMutasiFromKledo(
  dateFrom: string | null,
  dateTo: string | null,
  warehouseId?: string
) {
  const [loading, setLoading] = useState(true)
  const [getInvMutasiFromKledo, setGetInvMutasiFromKledo] = useState<Invoice[]>(
    []
  )

  useEffect(() => {
    if (!dateFrom || !dateTo) return

    const fetchData = async () => {
      setLoading(true)
      try {
        let allInvoices: Invoice[] = []
        let page = 1
        let hasMoreData = true
        while (hasMoreData) {
          const url = `${HOST}/finance/warehouses/transfers?per_page=500&page=${page}&date_from=${dateFrom}&date_to=${dateTo}${
            warehouseId ? `&warehouse_id=${warehouseId}` : ''
          }`

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          })
          //   https://extratrusslombok.api.kledo.com/api/v1/finance/warehouses/transfers?page=1&warehouse_id=7

          if (!response.ok) {
            throw new Error('Failed to fetch invoices')
          }

          const data = await response.json()
          console.log({ data })
          const formattedData: Invoice[] = data.data.data.map((inv: any) => ({
            id: inv.id,
            ref_number: inv.ref_number,
            status_id: inv.status_id,
            from_warehouse_id: inv.from_warehouse_id,
            qty: inv.qty,
            memo: inv.memo,
            trans_date: inv.trans_date,
            to_warehouse_id: inv.to_warehouse_id,
          }))

          allInvoices = [...allInvoices, ...formattedData]

          if (data.data.data.length < 500) {
            hasMoreData = false
          } else {
            page++
          }
        }

        setGetInvMutasiFromKledo(allInvoices)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateFrom, dateTo, warehouseId])

  const memoizedData = useMemo(
    () => getInvMutasiFromKledo,
    [getInvMutasiFromKledo]
  )

  return { loading, getInvMutasiFromKledo }
}

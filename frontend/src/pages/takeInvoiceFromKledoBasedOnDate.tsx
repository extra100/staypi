import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../config'
import TOKEN from '../token'

export interface Invoice {
  id: string
  ref_number: string
  contact_id: string
  warehouse_id: string
  name: string
  due: number
  amount: number
  trans_date: string
  items: {
    finance_account_id: number
    id: number
    name: string
    qty: number
    price: number
    amount: number
    price_after_tax: number
    amount_after_tax: number
    down_payment: number
    discount_percent: number
    discount_amount: number
    unit_id: number
  }[]
}

export function TakeInvoicesFromKledoBasedOnDate(
  dateFrom: string | null,
  dateTo: string | null,
  warehouseId?: string
) {
  const [loading, setLoading] = useState(true)
  const [getInvFromKledoBasedDate, setGetInvFromKledo] = useState<Invoice[]>([])

  useEffect(() => {
    if (!dateFrom || !dateTo) return

    const fetchData = async () => {
      setLoading(true)
      try {
        let allInvoices: Invoice[] = []
        let page = 1
        let hasMoreData = true

        while (hasMoreData) {
          const url = `${HOST}/finance/invoices?per_page=500&page=${page}&date_from=${dateFrom}&date_to=${dateTo}${
            warehouseId ? `&warehouse_id=${warehouseId}` : ''
          }`

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          })

          if (!response.ok) {
            throw new Error('Failed to fetch invoices')
          }

          const data = await response.json()
          console.log({ data })
          const formattedData: Invoice[] = data.data.data.map((inv: any) => ({
            id: inv.id,
            ref_number: inv.ref_number,
            contact_id: inv.contact_id,
            warehouse_id: inv.warehouse_id,
            name: inv.contact.name,
            due: inv.due,
            amount: inv.amount,
            trans_date: inv.trans_date,
            items:
              inv.items?.map((item: any) => ({
                finance_account_id: item.finance_account_id,
                id: item.id,
                name: item.name,
                qty: item.qty,
                price: item.price,
                amount: item.amount,
                price_after_tax: item.price_after_tax,
                amount_after_tax: item.amount_after_tax,
                down_payment: item.down_payment,
                discount_percent: item.discount_percent,
                discount_amount: item.discount_amount,
                unit_id: item.unit_id,
              })) || [],
          }))

          allInvoices = [...allInvoices, ...formattedData]

          if (data.data.data.length < 500) {
            hasMoreData = false
          } else {
            page++
          }
        }

        setGetInvFromKledo(allInvoices)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateFrom, dateTo, warehouseId])

  const memoizedData = useMemo(
    () => getInvFromKledoBasedDate,
    [getInvFromKledoBasedDate]
  )

  return { loading, getInvFromKledoBasedDate }
}

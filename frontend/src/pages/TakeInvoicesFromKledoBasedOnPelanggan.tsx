import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../config'
import TOKEN from '../token'

export interface Contact {
  id: string
  ref_number: string
  contact_id: string
  warehouse_id: string
  name: string
  due: number
  amount: number
  trans_date: string
}

export function TakeInvoicesFromKledoBasedOnPelanggan(
  contactId: string | null
) {
  const [loading, setLoading] = useState(true)
  const [
    takeInvoicesFromKledoBasedOnPelanggan,
    settakeInvoicesFromKledoBasedOnPelanggan,
  ] = useState<Contact[]>([])

  useEffect(() => {
    // Avoid fetching if contactId is not set
    if (!contactId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        let allContacts: Contact[] = []
        let page = 1
        let hasMoreData = true

        while (hasMoreData) {
          const response = await fetch(
            `${HOST}/finance/invoices?per_page=100000000&page=${page}&contact_id=${contactId}`,
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          )

          if (!response.ok) {
            throw new Error('Failed to fetch contacts')
          }

          const data = await response.json()

          const formattedData: Contact[] = data.data.data
            .filter((item: any) => item.due > 0)
            .map((item: any) => ({
              id: item.id,
              ref_number: item.ref_number,
              contact_id: item.contact_id,
              warehouse_id: item.warehouse_id,
              name: item.contact.name,

              due: item.due,
              amount: item.amount,

              trans_date: item.trans_date,
            }))
          allContacts = [...allContacts, ...formattedData]

          if (data.data.data.length < 100000000) {
            hasMoreData = false
          } else {
            page++
          }
        }

        settakeInvoicesFromKledoBasedOnPelanggan(allContacts)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [contactId])

  const memoizedData = useMemo(
    () => takeInvoicesFromKledoBasedOnPelanggan,
    [takeInvoicesFromKledoBasedOnPelanggan]
  )

  return { loading, takeInvoicesFromKledoBasedOnPelanggan: memoizedData }
}

import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'



export interface Contact {
  id: string
  ref_number: string
  status_id: string
  contact_id: string

  name: string
  due: number
  amount_after_tax: number
  trans_date: string
}

export function TakePiutangToPerContactStatusIdAndMemoMny(
  search: string | null,
  status_id: string | null,
  contact_id: string | null
) {
  const [loading, setLoading] = useState(true)
  const [
    takedueanContactStatusIdandMemoMny,
    setTakedueanContactStatusIdandMemoMny,
  ] = useState<Contact[]>([])

  useEffect(() => {
    if (!search && !status_id && !contact_id) return

    const fetchData = async () => {
      setLoading(true)
      try {
        let allContacts: Contact[] = []
        let page = 1
        let hasMoreData = true

        while (hasMoreData) {
          const response = await fetch(
            `${HOST}/finance/debitMemos?search=${search || ''}&status_id=${
              status_id || ''
            }&contact_id=${contact_id || ''}&per_page=150000000&page=${page}`,
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
          const formattedData: Contact[] = (data?.data?.data || []).map(
            (item: any) => ({
              id: item.id,
              ref_number: item.ref_number,
              status_id: item.status_id,
              name: item.contact?.name || 'Unknown',
              due: item.due,
              amount_after_tax: item.amount_after_tax,
              contact_id: item.contact_id,
              trans_date: item.trans_date,
            })
          )

          allContacts = [...allContacts, ...formattedData]

          if (data.data.data.length < 150000000) {
            hasMoreData = false
          } else {
            page++
          }
        }

        setTakedueanContactStatusIdandMemoMny(allContacts)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search, status_id, contact_id])

  const memoizedData = useMemo(
    () => takedueanContactStatusIdandMemoMny,
    [takedueanContactStatusIdandMemoMny]
  )

  return { loading, takedueanContactStatusIdandMemoMny }
}

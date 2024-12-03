import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../config'
import TOKEN from '../token'

export interface Invoice {
  id: string
  ref_number: string
  contact_id: string
  name: string
  due: number
  amount: number
  trans_date: string
  memo: string
}

export function TakeIdReturPayment(
  dateFrom: string | null,
  dateTo: string | null,
  search: { memorandum: string | null; selectedDate: string | null } | null
) {
  const [loadings, setLoadings] = useState(true)
  const [getIdReturPayment, setGetInvFromKledo] = useState<Invoice[]>([])
  const [pollingActive, setPollingActive] = useState(true) // State to control polling

  const fetchData = async () => {
    if (
      !dateFrom ||
      !dateTo ||
      !search ||
      !search.memorandum ||
      !search.selectedDate
    )
      return

    setLoadings(true)
    try {
      let allInvoices: Invoice[] = []
      let page = 1
      let hasMoreData = true

      while (hasMoreData) {
        const url = `${HOST}/finance/creditMemos?per_page=500&page=${page}&search=${search.memorandum}&date_from=${search.selectedDate}&date_to=${dateTo}`

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch invoices')
        }

        const data = await response.json()
        console.log('Fetched data:', data)

        const formattedData: Invoice[] = data.data.data.map((inv: any) => ({
          id: inv.id,
          ref_number: inv.ref_number,
          contact_id: inv.contact_id,
          name: inv.contact?.name || 'Unknown Contact',
          due: inv.due,
          amount: inv.amount,
          memo: inv.memo,
          trans_date: inv.trans_date,
        }))

        allInvoices = [...allInvoices, ...formattedData]

        if (data.data.data.length < 500) {
          hasMoreData = false
        } else {
          page++
        }
      }

      setGetInvFromKledo(allInvoices)

      const memoFound = allInvoices.some(
        (invoice) => invoice.memo === search.memorandum
      )

      if (memoFound) {
        setPollingActive(false) // Stop polling when memo is found
        console.log(`Memo "${search.memorandum}" found!`)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoadings(false)
    }
  }

  useEffect(() => {
    fetchData() // Initial fetch

    const interval = setInterval(() => {
      if (pollingActive) {
        fetchData() // Refetch only if polling is active
      } else {
        clearInterval(interval) // Stop polling
      }
    }, 1000)

    return () => clearInterval(interval) // Cleanup on unmount
  }, [dateFrom, dateTo, search, pollingActive])

  const memoizedData = useMemo(() => getIdReturPayment, [getIdReturPayment])

  return { loadings, getIdReturPayment: memoizedData }
}

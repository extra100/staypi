import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Invoice {
  id: number
  ref_number: string
}

export function useIdInvoice(ref_number: string) {
  const [loading, setLoading] = useState(true)
  const [getIdAtInvoice, setgetIdAtInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data exists in sessionStorage
        const storedData = sessionStorage.getItem('getIdAtInvoice')
        if (storedData) {
          const parsedData: Invoice[] = JSON.parse(storedData)

          const matchedInvoice = parsedData.find(
            (invoice) => invoice.ref_number === ref_number
          )
          if (matchedInvoice) {
            setgetIdAtInvoice(matchedInvoice)
            setLoading(false)
            return
          }
        }

        // Fetch from API
        const responGudang = await fetch(
          `${HOST}/finance/invoices?ref_number=${ref_number}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )
        //
        if (!responGudang.ok) {
          throw new Error('Failed to fetch data from API')
        }

        const dataGudang = await responGudang.json()

        // Accessing the correct path for data
        if (dataGudang.data && dataGudang.data.data.length > 0) {
          const matchedInvoice = dataGudang.data.data.find(
            (item: Invoice) => item.ref_number === ref_number
          )

          if (matchedInvoice) {
            setgetIdAtInvoice(matchedInvoice)

            // Store in sessionStorage for future requests
            sessionStorage.setItem(
              'getIdAtInvoice',
              JSON.stringify([matchedInvoice])
            )
          }
        }

        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    if (ref_number) {
      fetchData()
    }
  }, [ref_number]) // Fetching only when ref_number changes

  // Memoize the fetched invoice data
  const memoizedData = useMemo(() => getIdAtInvoice, [getIdAtInvoice])

  return { loading, getIdAtInvoice }
}

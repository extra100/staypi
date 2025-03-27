import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface PembayaranBank {
  id: number
  ids: string
  items: {
    id: number
    finance_account_id: number
  }[]
}

export function useIdPembayaranBank(ids: any) {
  const [loading, setLoading] = useState(true)
  const [getIdAtPembayaranBank, setgetIdAtPembayaranBank] =
    useState<PembayaranBank | null>(null)
  const [refetchAttempted, setRefetchAttempted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('getIdAtPembayaranBank')
        if (storedData) {
          const parsedData: PembayaranBank[] = JSON.parse(storedData)
          const matchedInvoice = parsedData.find(
            (invoice) => invoice.ids === ids
          )
          if (matchedInvoice) {
            setgetIdAtPembayaranBank(matchedInvoice)
            setLoading(false)
            return
          }
        }

        let allInvoices: PembayaranBank[] = []
        let page = 1
        const perPage = 20
        let isDataFound = false

        console.log(`Fetching page ${page}...`)
        const responGudang = await fetch(
          `${HOST}/finance/warehouses/transfers?ids=${ids}&page=${page}&perPage=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!responGudang.ok) {
          throw new Error('Failed to fetch data from API')
        }

        const dataGudang = await responGudang.json()

        if (dataGudang.data && dataGudang.data.data.length > 0) {
          console.log(`Data found on page ${page}`)
          allInvoices = allInvoices.concat(dataGudang.data.data)

          const matchedInvoice = dataGudang.data.data.find(
            (item: PembayaranBank) => item.ids === ids
          )

          if (matchedInvoice) {
            console.log('Matched invoice found:', matchedInvoice)
            setgetIdAtPembayaranBank(matchedInvoice)
            setLoading(false)

            sessionStorage.setItem(
              'getIdAtPembayaranBank',
              JSON.stringify(allInvoices)
            )
            isDataFound = true
          }
        } else {
          console.log(`No data on page ${page}`)
        }

        if (!isDataFound && page === 1 && !refetchAttempted) {
          setRefetchAttempted(true)
          fetchData()
          return
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    if (ids) {
      fetchData()
    }
  }, [ids])

  const memoizedData = useMemo(
    () => getIdAtPembayaranBank,
    [getIdAtPembayaranBank]
  )

  return { loading, getIdAtPembayaranBank }
}

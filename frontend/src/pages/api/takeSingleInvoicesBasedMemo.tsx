import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Invoice {
  id: number
  memo: string // Mengganti ref_number dengan memo sebagai property
}

export function useIdBasedMemoAndrefNumber(ref_number: string) {
  const [loading, setLoading] = useState(true)
  const [
    getIdFromKledoBasedRefNumberAndMemo,
    setgetIdFromKledoBasedRefNumberAndMemo,
  ] = useState<Invoice | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem(
          'getIdFromKledoBasedRefNumberAndMemo'
        )
        if (storedData) {
          const parsedData: Invoice[] = JSON.parse(storedData)

          const matchedInvoice = parsedData.find(
            (invoice) => invoice.memo === ref_number // Mencari berdasarkan property memo
          )
          if (matchedInvoice) {
            setgetIdFromKledoBasedRefNumberAndMemo(matchedInvoice)
            setLoading(false)
            return
          }
        }

        let allInvoices: Invoice[] = []
        let page = 1
        const perPage = 10
        let hasMoreData = true

        while (
          allInvoices.length < 10 &&
          hasMoreData &&
          !getIdFromKledoBasedRefNumberAndMemo
        ) {
          const responGudang = await fetch(
            `${HOST}/finance/invoices?ref_number=${ref_number}&page=${page}&perPage=${perPage}`,
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
            allInvoices = allInvoices.concat(dataGudang.data.data)
            const matchedInvoice = dataGudang.data.data.find(
              (item: Invoice) => item.memo === ref_number // Cari berdasarkan property memo
            )

            if (matchedInvoice) {
              setgetIdFromKledoBasedRefNumberAndMemo(matchedInvoice)
              setLoading(false)

              sessionStorage.setItem(
                'getIdFromKledoBasedRefNumberAndMemo',
                JSON.stringify(allInvoices)
              )
              return
            }

            page += 1
          } else {
            hasMoreData = false
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
  }, [ref_number])

  const memoizedData = useMemo(
    () => getIdFromKledoBasedRefNumberAndMemo,
    [getIdFromKledoBasedRefNumberAndMemo]
  )

  return { loading, getIdFromKledoBasedRefNumberAndMemo }
}

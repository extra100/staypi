import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Mutation {
  id: number
  ref_number: string
  items: {
    id: number
    finance_account_id: number
  }[]
}

export function useIdMutation(ref_number: any) {
  const [loading, setLoading] = useState(true)
  const [getIdAtMutation, setgetIdAtMutation] = useState<Mutation | null>(null)
  const [refetchAttempted, setRefetchAttempted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('getIdAtMutation')
        if (storedData) {
          const parsedData: Mutation[] = JSON.parse(storedData)
          const matchedInvoice = parsedData.find(
            (invoice) => invoice.ref_number === ref_number
          )
          if (matchedInvoice) {
            setgetIdAtMutation(matchedInvoice)
            setLoading(false)
            return
          }
        }

        let allInvoices: Mutation[] = []
        let page = 1
        const perPage = 20
        let isDataFound = false

        console.log(`Fetching page ${page}...`)
        const responGudang = await fetch(
          `${HOST}/finance/warehouses/transfers?ref_number=${ref_number}&page=${page}&perPage=${perPage}`,
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
            (item: Mutation) => item.ref_number === ref_number
          )

          if (matchedInvoice) {
            console.log('Matched invoice found:', matchedInvoice)
            setgetIdAtMutation(matchedInvoice)
            setLoading(false)

            sessionStorage.setItem(
              'getIdAtMutation',
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

    if (ref_number) {
      fetchData()
    }
  }, [ref_number])

  const memoizedData = useMemo(() => getIdAtMutation, [getIdAtMutation])

  return { loading, getIdAtMutation }
}

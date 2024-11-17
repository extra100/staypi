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
  console.log({ getIdAtMutation })
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
            return // Stop fetching
          }
        }

        let allInvoices: Mutation[] = []
        let page = 1
        const perPage = 20
        let hasMoreData = true

        while (hasMoreData) {
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
            allInvoices = allInvoices.concat(dataGudang.data.data)

            const matchedInvoice = dataGudang.data.data.find(
              (item: Mutation) => item.ref_number === ref_number
            )

            if (matchedInvoice) {
              setgetIdAtMutation(matchedInvoice)
              setLoading(false)

              sessionStorage.setItem(
                'getIdAtMutation',
                JSON.stringify(allInvoices)
              )
              return // Stop fetching as soon as a match is found
            }

            page += 1
          } else {
            hasMoreData = false // No more data to fetch
          }
        }

        setLoading(false) // Set loading to false if no match is found
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    if (ref_number) {
      fetchData()
    }
  }, [ref_number]) // Trigger effect only when ref_number changes

  const memoizedData = useMemo(() => getIdAtMutation, [getIdAtMutation])

  return { loading, getIdAtMutation }
}

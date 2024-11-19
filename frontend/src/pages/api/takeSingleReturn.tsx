import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Return {
  memo: string
  id: number
  business_tran_id: number
  ref_number: string
  items: {
    id: number
    memo: string
    amount: number
    discount_amount: number
    discount_percent: number
    finance_account_id: number
    price: number
    qty: number
    // idPadaItems: number
  }[]
}

export function useIdReturn(memo: any) {
  const [loading, setLoading] = useState(true)
  const [getIdAtReturn, setgetIdAtReturn] = useState<Return | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('getIdAtReturn')
        if (storedData) {
          const parsedData: Return[] = JSON.parse(storedData)

          const matchedReturn = parsedData.find(
            (Return) => Return.memo === memo
          )
          if (matchedReturn) {
            setgetIdAtReturn(matchedReturn)
            setLoading(false)
            return // Stop fetching
          }
        }

        let allReturns: Return[] = []
        let page = 1
        const perPage = 20
        let hasMoreData = true

        while (hasMoreData) {
          const responGudang = await fetch(
            `${HOST}/finance/returns?id=${memo}&page=${page}&perPage=${perPage}&include_items=1`,
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
          console.log('Response dari Gudang:', dataGudang)

          if (dataGudang.data && dataGudang.data.data.length > 0) {
            allReturns = allReturns.concat(dataGudang.data.data)

            const matchedInvoice = dataGudang.data.data.find(
              (item: Return) => item.memo === memo
            )
            console.log('matchedInvoice dari matchedInvoice:', matchedInvoice)

            if (matchedInvoice) {
              setgetIdAtReturn(matchedInvoice)
              setLoading(false)

              sessionStorage.setItem(
                'getIdAtReturn',
                JSON.stringify(allReturns)
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

    if (memo) {
      fetchData()
    }
  }, [memo]) // Trigger effect only when id changes

  const memoizedData = useMemo(() => getIdAtReturn, [getIdAtReturn])

  return { loading, getIdAtReturn }
}

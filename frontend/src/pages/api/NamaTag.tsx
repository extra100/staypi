import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface DataTag {
  id: number
  name: string
}

export function useIdNamaTag() {
  const [loading, setLoading] = useState(true)
  const [idDataTag, setIdDataTag] = useState<DataTag[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('TagTransactions')
        if (storedData) {
          setIdDataTag(JSON.parse(storedData))
          setLoading(false)
          return
        }

        const response = await fetch(`${HOST}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials',
          }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        const accessToken = data.access_token

        const bankTransResponse = await fetch(
          `${HOST}/finance/tags?page=1&per_page=2000`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!bankTransResponse.ok) {
          throw new Error('Failed to fetch bank transactions')
        }

        const bankTransData = await bankTransResponse.json()
        const formattedData: DataTag[] = bankTransData.data.data.map(
          (item: DataTag) => ({
            id: item.id,
            name: item.name,
          })
        )

        setIdDataTag(formattedData)
        sessionStorage.setItem('TagTransactions', JSON.stringify(formattedData))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const memoizedData = useMemo(() => idDataTag, [idDataTag])

  return { loading, idDataTag }
}

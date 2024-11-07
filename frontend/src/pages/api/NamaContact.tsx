import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'

export interface Contact {
  id: string
  name: string
  group_id: string
  group_name: string
  receivable: number
}

export function useIdContact(groupId: string | null) {
  const [loading, setLoading] = useState(true)
  const [idContact, setIdContact] = useState<Contact[]>([])

  useEffect(() => {
    // Avoid fetching if groupId is not set
    if (!groupId) return

    const fetchData = async () => {
      setLoading(true)
      try {
        let allContacts: Contact[] = []
        let page = 1
        let hasMoreData = true

        while (hasMoreData) {
          const response = await fetch(
            `${HOST}/finance/contacts?per_page=400&page=${page}&group_id=${groupId}`,
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

          const formattedData: Contact[] = data.data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            group_id: item.group?.id ?? 'unknown',
            group_name: item.group?.name ?? 'unknown',
            receivable: item.receivable,
          }))

          allContacts = [...allContacts, ...formattedData]

          if (data.data.data.length < 400) {
            hasMoreData = false
          } else {
            page++
          }
        }

        setIdContact(allContacts)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [groupId])

  const memoizedData = useMemo(() => idContact, [idContact])

  return { loading, idContact: memoizedData }
}

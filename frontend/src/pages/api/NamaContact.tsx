import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Contact {
  id: string
  name: string
  group_id: string
  group_name: string
  receivable: number
}

export function useIdContact() {
  const [loading, setLoading] = useState(true)
  const [idContact, setIdContact] = useState<Contact[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let allContacts: Contact[] = []
        let page = 1
        let hasMoreData = true

        while (hasMoreData) {
          const contactResponse = await fetch(
            `${HOST}/finance/contacts?page=${page}&per_page=200`,
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          )

          if (!contactResponse.ok) {
            throw new Error('Failed to fetch contacts')
          }

          const dataContact = await contactResponse.json()
          const formattedData: Contact[] = dataContact.data.data.map(
            (item: any) => {
              const groupId = item.group?.id ?? 'unknown'
              const groupName = item.group?.name ?? 'unknown'

              return {
                id: item.id,
                name: item.name,
                group_id: groupId,
                group_name: groupName,
                receivable: item.receivable,
              }
            }
          )

          allContacts = [...allContacts, ...formattedData]

          if (dataContact.data.data.length < 200) {
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
  }, [])

  const memoizedData = useMemo(() => idContact, [idContact])

  return { loading, idContact: memoizedData }
}

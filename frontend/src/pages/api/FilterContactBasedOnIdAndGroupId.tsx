import React, { useState, useEffect } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface Contact {
  id: number
  name: number
  group_id: number
  group_name: string
  receivable: number
}

interface FilteredContactProps {
  selectedId?: number
  selectedGroupId?: number
}

const FilteredContact: React.FC<FilteredContactProps> = ({
  selectedId,
  selectedGroupId,
}) => {
  const [loading, setLoading] = useState(true)
  const [idContact, setIdContact] = useState<Contact[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let allContacts: Contact[] = []
        let page = 1
        let hasMoreData = true

        // Construct the URL with the selected filters
        let url = `${HOST}/finance/contacts?page=${page}&per_page=200`
        if (selectedId) {
          url += `&id=${selectedId}`
        }
        if (selectedGroupId) {
          url += `&group_id=${selectedGroupId}`
        }

        while (hasMoreData) {
          const contactResponse = await fetch(url, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          })

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
  }, [selectedId, selectedGroupId])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h2>Filtered Contacts</h2>
      <ul>
        {idContact.map((contact) => (
          <li key={contact.id}>
            {contact.name} - {contact.group_name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FilteredContact

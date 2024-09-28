import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchContacts } from '../pages/api/contactsApi'

const Contacts: React.FC = () => {
  const { data, error, isLoading } = useQuery(['contacts'], fetchContacts)

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {data?.map((contact: any) => (
          <li key={contact.id}>
            {contact.name} - Group: {contact.group_name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Contacts

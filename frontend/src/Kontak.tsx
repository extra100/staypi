import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { fetchContacts } from './pages/api/contactsApi'

const Contacts: React.FC = () => {
  const { data, error, isLoading } = useQuery<any[], Error>(
    ['contacts'], // Query key
    fetchContacts // Function to fetch data
  )

  // Log the state for debugging
  console.log('Loading:', isLoading)
  console.log('Error:', error)
  console.log('Data:', data)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading contacts: {error.message}</div>

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {data?.map((contact) => (
          <li key={contact.id}>
            {contact.name} - Group: {contact.group_name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Contacts

// src/components/Contacts.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table } from 'antd'
import 'antd/dist/reset.css' // Import Ant Design styles

interface Contact {
  id: string
  name: string
  group_id: string
  group_name: string
  receivable: number
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/contacts')
        setContacts(response.data.contacts)
      } catch (err) {
        setError('Failed to fetch contacts')
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Group ID', dataIndex: 'group_id', key: 'group_id' },
    { title: 'Group Name', dataIndex: 'group_name', key: 'group_name' },
    { title: 'Receivable', dataIndex: 'receivable', key: 'receivable' },
  ]

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return <Table dataSource={contacts} columns={columns} rowKey="id" />
}

export default Contacts

import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'
import {
  useAddContact,
  useGetThenAddContactsQuery,
} from '../../hooks/contactHooks'
import { Contact } from '../../types/Contact'

const BatchProcessContacts = () => {
  const [offset, setOffset] = useState(0)
  const batchSize = 10
  const [isProcessing, setIsProcessing] = useState(false)
  const [allContacts, setAllContacts] = useState<Contact[]>([])
  const [contactSet, setContactSet] = useState(new Set<number>())

  const {
    data: contacts,
    refetch,
    isLoading,
  } = useGetThenAddContactsQuery(batchSize, offset)
  const addContactMutation = useAddContact()

  useEffect(() => {
    if (!contacts || contacts.length === 0) return

    const newContacts = contacts.filter(
      (contact: any) => !contactSet.has(contact.id)
    )

    setContactSet((prevSet) => {
      const updatedSet = new Set(prevSet)
      newContacts.forEach((contact: any) => updatedSet.add(contact.id))
      return updatedSet
    })

    setAllContacts((prevContacts) => [
      ...prevContacts,
      ...newContacts.map((contact: any) => ({
        ...contact,
        id: Number(contact.id),
        group_id: Number(contact.group_id),
        group: contact.group
          ? {
              ...contact.group,
              id: Number(contact.group.id),
            }
          : undefined,
      })),
    ])

    if (contacts.length === batchSize) {
      setTimeout(() => setOffset((prevOffset) => prevOffset + batchSize), 500)
    }
  }, [contacts])

  useEffect(() => {
    if (offset > 0) {
      refetch()
    }
  }, [offset])

  const handleSave = async () => {
    setIsProcessing(true)

    for (let i = 0; i < allContacts.length; i += batchSize) {
      const batch = allContacts.slice(i, i + batchSize)

      for (const contact of batch) {
        try {
          await addContactMutation.mutateAsync(contact)
          console.log(`Successfully added contact: ${contact.name}`)
        } catch (error) {
          console.error(`Failed to add contact: ${contact.name}`, error)
        }
      }
    }

    setIsProcessing(false)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name Kontak',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Group ID',
      dataIndex: ['group', 'id'],
      key: 'groupId',
      render: (text: any) => (text ? text : 'N/A'),
    },
    {
      title: 'Group Name',
      dataIndex: ['group', 'name'],
      key: 'groupName',
      render: (text: any) => (text ? text : 'N/A'),
    },
  ]

  return (
    <div>
      <h1>Contact List</h1>
      {isLoading ? (
        <Spin tip="Loading contacts..." />
      ) : (
        <Table dataSource={allContacts} columns={columns} rowKey="id" />
      )}

      <Button
        type="primary"
        onClick={handleSave}
        disabled={isProcessing || isLoading}
        loading={isProcessing}
        style={{ marginTop: 16 }}
      >
        {isProcessing ? 'Saving...' : 'Save All Contacts'}
      </Button>
    </div>
  )
}

export default BatchProcessContacts

import React, { useState, useEffect, useContext } from 'react'
import { Table, Tag } from 'antd'

import { useGetTransaksisQuery } from '../hooks/transactionHooks'
import { useIdInvoice } from './api/takeSingleInvoice'
import UserContext from '../contexts/UserContext'
import { useGetContactsQuery } from '../hooks/contactHooks'

const ListTransaksi: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )
  const { data: contacts } = useGetContactsQuery()

  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(user.id_outlet)
    }
  }, [user])

  const { data } = useGetTransaksisQuery()
  const [selectedRefNumber, setSelectedRefNumber] = useState<string | null>(
    null
  )
  const { getIdAtInvoice } = useIdInvoice(selectedRefNumber || '')

  const handleRefNumberClick = (ref_number: string) => {
    setSelectedRefNumber(ref_number)
  }

  // Helper function to get contact name by contact id
  const getContactName = (contactId: string) => {
    const contact = contacts?.find((c: any) => c.id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  const filteredData = data
    ?.filter(
      (transaction) => transaction.warehouse_id === Number(user?.id_outlet)
    )
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'ref_number',
      key: 'ref_number',
      render: (text: any, record: any) => (
        <a
          href={`/detailkledo/${record.ref_number}`}
          onClick={() => handleRefNumberClick(record.ref_number)}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Contact Name',
      dataIndex: ['contacts', 0, 'id'],
      key: 'contact_name',
      render: (contactId: string) => getContactName(contactId),
    },
    {
      title: 'Status',
      dataIndex: 'status_id',
      key: 'status_id',
      render: (status_id: number) => {
        let color = ''
        let text = ''

        switch (status_id) {
          case 1:
            color = 'red'
            text = 'Belum Dibayar'
            break
          case 2:
            color = 'orange'
            text = 'Dibayar Sebagian'
            break
          case 3:
            color = 'green'
            text = 'Lunas'
            break
          default:
            color = 'gray'
            text = 'Unknown Status'
        }

        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: 'Terbayar',
      dataIndex: 'down_payment',
      key: 'down_payment',
    },
    {
      title: 'Sisa Tagihan',
      dataIndex: 'due',
      key: 'due',
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
    },
  ]

  return (
    <div>
      <h1>Daftar Transaksi</h1>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default ListTransaksi

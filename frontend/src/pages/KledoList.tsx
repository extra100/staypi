import React from 'react'
import { Table, Spin, Alert, Tag } from 'antd'
import { useGetTransaksisQuery } from '../hooks/transactionHooks'

const ListTransaksi: React.FC = () => {
  const { data } = useGetTransaksisQuery()
  console.log({ data })
  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'ref_number',
      key: 'ref_number',
      render: (text: any, record: any) => (
        <a href={`/detailkledo/${record.ref_number}`}>{text}</a>
      ),
    },
    {
      title: 'Contact Name',
      dataIndex: ['contacts', 0, 'name'], // Access the first contact's name
      key: 'contact_name',
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
        dataSource={data}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

export default ListTransaksi

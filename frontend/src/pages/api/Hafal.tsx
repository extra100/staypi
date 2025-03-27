import React, { useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface Order {
  info: string
  amount: number
  id_order: string
}

interface IntHafal {
  id: number
  name: string
  address: string
  orders: Order[]
}

const Hafalan: React.FC = () => {
  const [x, setX] = useState<number | null>(null)

  const data: IntHafal[] = [
    {
      id: 1,
      name: 'John',
      address: 'Gamang',
      orders: [
        {
          id_order: 'inv/92932',
          amount: 20000,
          info: '--',
        },
        { id_order: 'inv/9585', amount: 487589, info: 'next' },
      ],
    },
    {
      id: 2,
      name: 'Kini',
      address: 'Cupang',
      orders: [
        {
          id_order: 'inv/8322',
          amount: 6363,
          info: 'ds',
        },
      ],
    },
  ]

  const columns: ColumnsType<IntHafal> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Orders',
      key: 'orders',
      render: (_, record) => {
        const totalAmount = record.orders.reduce(
          (acc, order) => acc + order.amount,
          0
        )

        return (
          <>
            <p>Total Amount: {totalAmount}</p>
          </>
        )
      },
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id.toString()}
      />
    </>
  )
}

export default Hafalan

import React from 'react'
import { Table, Spin } from 'antd'
import { useIdNamaBarang } from './NamaBarang'

const BarangTable: React.FC = () => {
  const { loading, idaDataBarang } = useIdNamaBarang()

  const columns = [
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => `Rp ${text.toLocaleString()}`,
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'name'],
      key: 'unit',
      render: (text: string) => (text ? text : 'Unknown'),
    },
  ]

  return (
    <Spin spinning={loading}>
      <Table
        dataSource={idaDataBarang}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Spin>
  )
}

export default BarangTable

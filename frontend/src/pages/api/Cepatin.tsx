import React from 'react'
import { Table, Spin, Alert } from 'antd'
import { useGetProductsQuery } from '../../hooks/productHooks'

const ProductTable: React.FC = () => {
  const { data, error, isLoading } = useGetProductsQuery()
  console.log({ data })
  if (isLoading) return <Spin size="large" />
  if (error)
    return (
      <Alert
        message="Error"
        description="Error loading products"
        type="error"
      />
    )

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
  ]

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={false} // Optionally set pagination here if needed
    />
  )
}

export default ProductTable

import React, { useState } from 'react'
import { Input, Table, Spin } from 'antd'
import { useIdProduct } from './SingleProduct'

const { Search } = Input

const ProductLookup = () => {
  const [productIdse, setProductIds] = useState<string>('')

  const { idProduct, loading } = useIdProduct(productIdse)

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

  const data = idProduct ? [idProduct] : []

  const handleSearch = (value: string) => {
    setProductIds(value)
  }

  return (
    <div style={{ padding: '20px' }}>
      <Search
        placeholder="Enter product ID"
        enterButton="Search"
        onSearch={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
        />
      )}
    </div>
  )
}

export default ProductLookup

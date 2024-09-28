import React, { useState, useEffect } from 'react'
import { Table, Button, Spin } from 'antd'
import { useStokWarehouse } from './FinanceWarehiuseID'
import { useIdNamaBarang } from './NamaBarang'

const StokWarehouseComponent: React.FC = () => {
  const [warehouseId, setWarehouseId] = useState<number | null>(null)
  const { stokWarehouseId, fetchWarehouseId } = useStokWarehouse()
  const { idaDataBarang } = useIdNamaBarang()
  console.log({ idaDataBarang })
  useEffect(() => {
    if (warehouseId !== null) {
      fetchWarehouseId(warehouseId)
    }
  }, [warehouseId, fetchWarehouseId])

  useEffect(() => {
    console.log('stokWarehouseId:', stokWarehouseId)
  }, [stokWarehouseId])

  const handleWarehouseSelect = (id: number) => {
    setWarehouseId(id)
  }

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Price',
      dataIndex: 'product_val',
      key: 'product_val',
      render: (text: number) => `Rp ${text.toLocaleString()}`,
    },
  ]

  if (warehouseId !== null && !stokWarehouseId) {
    return <Spin size="large" />
  }

  const dataSource = stokWarehouseId ? stokWarehouseId.products.data : []

  return (
    <div>
      <Button onClick={() => handleWarehouseSelect(7)}>
        Select Warehouse 7
      </Button>
      <Button onClick={() => handleWarehouseSelect(8)}>
        Select Warehouse 8
      </Button>

      {dataSource.length > 0 ? (
        <Table dataSource={dataSource} columns={columns} rowKey="product_id" />
      ) : (
        <p>No products available for the selected warehouse.</p>
      )}
    </div>
  )
}

export default StokWarehouseComponent

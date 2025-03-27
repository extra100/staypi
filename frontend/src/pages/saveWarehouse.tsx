import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'

import { Warehouse } from '../types/Warehouse'
import {
  useAddWarehouse,
  useGetThenAddWarehousesQuery,
} from '../hooks/warehouseHooks'

const BatchProcessWarehouses = () => {
  const [offset, setOffset] = useState(0)
  const batchSize = 10
  const [isProcessing, setIsProcessing] = useState(false)
  const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([])
  const [warehouseSet, setWarehouseSet] = useState(new Set())

  const {
    data: warehouses,
    refetch,
    isLoading,
  } = useGetThenAddWarehousesQuery(batchSize, offset)
  const addWarehouseMutation = useAddWarehouse()

  useEffect(() => {
    if (!warehouses || warehouses.length === 0) return

    const newWarehouses = warehouses.filter(
      (warehouse) => !warehouseSet.has(warehouse.id)
    )
    setWarehouseSet((prevSet) => {
      const updatedSet = new Set(prevSet)
      newWarehouses.forEach((warehouse) => updatedSet.add(warehouse.id))
      return updatedSet
    })
    //
    // setAllWarehouses((prevWarehouses) => [...prevWarehouses, ...newWarehouses])

    if (warehouses.length === batchSize) {
      setTimeout(() => setOffset((prevOffset) => prevOffset + batchSize), 500)
    }
  }, [warehouses])

  useEffect(() => {
    if (offset > 0) {
      refetch()
    }
  }, [offset])

  const handleSave = async () => {
    setIsProcessing(true)

    for (let i = 0; i < allWarehouses.length; i += batchSize) {
      const batch = allWarehouses.slice(i, i + batchSize)

      for (const warehouse of batch) {
        try {
          await addWarehouseMutation.mutateAsync(warehouse)
          console.log(`Successfully added warehouse: ${warehouse.name}`)
        } catch (error) {
          console.error(`Failed to add warehouse: ${warehouse.name}`, error)
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Alamat',
      dataIndex: 'code',
      key: 'code',
    },
  ]

  return (
    <div>
      <h1>Warehouse List</h1>
      {isLoading ? (
        <Spin tip="Loading warehouses..." />
      ) : (
        <Table
          dataSource={allWarehouses}
          columns={columns}
          rowKey="id"
          // pagination={true}
        />
      )}

      <Button
        type="primary"
        onClick={handleSave}
        disabled={isProcessing || isLoading}
        loading={isProcessing}
        style={{ marginTop: 16 }}
      >
        {isProcessing ? 'Saving...' : 'Save All Warehouses'}
      </Button>
    </div>
  )
}

export default BatchProcessWarehouses

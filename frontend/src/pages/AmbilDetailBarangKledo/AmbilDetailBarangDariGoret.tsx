import React, { useState, useEffect, useMemo } from 'react'
import { Select, Col, Table, Input, message, Button } from 'antd'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useWarehouseStock } from '../api/fetchSemuaStok'
import SingleDate from '../SingleDate'
import {
  useAmbilDetailBarangGoretsQuery,
  useSimpanDetailBarangDariGoretMutation,
} from '../../hooks/ambilDetailBarangDariGoretHooks'

const AmbilDetailBarangDariGoret = () => {
  const { data: gudangdb } = useGetWarehousesQuery()
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null
  )
  const { mutate: simpanDetailBarangDariGoret } =
    useSimpanDetailBarangDariGoretMutation()

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  // const [clearedWarehouseStock, setClearedWarehouseStock] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data: warehouseStock } = useAmbilDetailBarangGoretsQuery()
  console.log({ warehouseStock })

  // useEffect(() => {
  //   setClearedWarehouseStock([])
  // }, [selectedWarehouseId])

  const handleWarehouseChange = (value: number) => {
    setSelectedWarehouseId(value)
  }

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const filteredStock = useMemo(() => {
    return warehouseStock
      ? warehouseStock
          .filter((item: any) => item.stock > 0)
          .filter(
            (item: any) =>
              item.name.toLowerCase().includes(searchTerm) ||
              item.id.toString().includes(searchTerm)
          )
      : []
  }, [warehouseStock, searchTerm])

  //
  const handleSave = () => {
    filteredStock.forEach((item) => {
      simpanDetailBarangDariGoret(
        {
          ...item,
          warehouse_id: selectedWarehouseId,
          start_date: selectedDate,
        } as any,
        {
          onSuccess: () => {
            message.success(`Data for ${item.name} saved successfully!`)
          },
          onError: () => {
            message.error(`Failed to save data for ${item.name}`)
          },
        }
      )
    })
  }

  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'code',
      dataIndex: 'code',
      key: 'code',
    },
  ]

  return (
    <div>
      <Col span={12}>
        <Select
          placeholder="Warehouse"
          showSearch
          style={{ width: '70%' }}
          optionFilterProp="label"
          filterOption={(input: any, option: any) =>
            option?.label
              ?.toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={selectedWarehouseId}
          onChange={handleWarehouseChange}
          disabled={!gudangdb}
        >
          {gudangdb?.map((warehouse) => (
            <Select.Option
              key={warehouse.id}
              value={warehouse.id}
              label={warehouse.name}
            >
              {warehouse.name}
            </Select.Option>
          ))}
        </Select>
      </Col>

      <Col span={12}>
        <SingleDate value={selectedDate as any} onChange={handleDateChange} />
      </Col>

      <Col span={12}>
        <Input
          placeholder="Search by Product ID or Name"
          style={{ width: '70%', marginTop: 16 }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Col>

      <Table
        dataSource={filteredStock}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Button type="primary" onClick={handleSave} style={{ margin: '16px 0' }}>
        Save Filtered Stock
      </Button>
    </div>
  )
}

export default AmbilDetailBarangDariGoret

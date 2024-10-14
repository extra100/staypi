import React, { useState, useEffect, useContext } from 'react'
import { Table, Select, DatePicker, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useGetBarangsQuery } from '../../hooks/barangHooks'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useWarehouseStock } from './fetchSemuaStok'
import UserContext from '../../contexts/UserContext'
const { Option } = Select

interface Product {
  key: number
  name: string
  qty: number
}

const ListStok: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const idOutletLoggedIn = user ? String(user.id_outlet) : '0'

  const { data: warehouses, isLoading: isLoadingWarehouses } =
    useGetWarehousesQuery()
  const { data: barangs, isLoading: isLoadingBarangs } = useGetBarangsQuery()

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(undefined)
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  )

  // Set the initial selected warehouse based on idOutletLoggedIn
  useEffect(() => {
    if (idOutletLoggedIn) {
      setSelectedWarehouse(idOutletLoggedIn)
    }
  }, [idOutletLoggedIn])

  // Fetch warehouse stock when warehouse or date changes
  const { warehouseStock } = useWarehouseStock(
    selectedDate || '',
    selectedWarehouse
  )
  console.log({ warehouseStock })

  useEffect(() => {
    if (barangs) {
      // Mapping barang data to product format
      const initialProducts = barangs.map((barang: any) => ({
        key: barang.id,
        name: barang.name,
        qty: barang.jumlah_stok,
      }))
      setProducts(initialProducts)
    }
  }, [barangs])

  useEffect(() => {
    if (warehouseStock && products.length > 0) {
      const updatedProducts = products.map((product) => {
        const stockData = warehouseStock.find(
          (stock) => stock.id === product.key
        )
        return {
          ...product,
          qty: stockData ? stockData.stock : 0, // Update qty with stock data
        }
      })

      // Filter out products with qty = 0
      const filtered = updatedProducts.filter((product) => product.qty > 0)
      setFilteredProducts(filtered)
    }
  }, [warehouseStock, products])

  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value)
  }

  const handleDateChange = (date: any) => {
    if (date) {
      setSelectedDate(date.format('DD-MM-YYYY')) // Format the date as needed
    } else {
      setSelectedDate(undefined)
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Nama Barang',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          value={selectedWarehouse} // Set the value to selectedWarehouse
          placeholder="Pilih Warehouse"
          onChange={handleWarehouseChange}
          style={{ width: 200 }}
          loading={isLoadingWarehouses}
        >
          {warehouses?.map((warehouse: any) => (
            <Option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </Option>
          ))}
        </Select>

        <DatePicker
          placeholder="Pilih Tanggal"
          onChange={handleDateChange}
          format="DD-MM-YYYY" // Adjusted format
        />
      </Space>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        pagination={true}
      />
    </div>
  )
}

export default ListStok

import React, { useState, useEffect, useMemo } from 'react'
import { Select, Col, Table, Input } from 'antd'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useWarehouseStock } from './fetchSemuaStok'
import SingleDate from '../SingleDate'
import { useGetTransaksisQuery } from '../../hooks/transactionHooks'
import { useGetWarehouseTransfersQuery } from '../../hooks/pindahHooks'
import { useNavigate } from 'react-router-dom'
import {
  useAmbilDetailBarangGoretsGudangdanQuery,
  useAmbilDetailBarangGoretsQuery,
} from '../../hooks/ambilDetailBarangDariGoretHooks'
import { useGetReturnssQuery } from '../../hooks/returnHooks'

const LaporanStock = () => {
  const { data: gudangdb } = useGetWarehousesQuery()

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    null
  )
  console.log({ selectedWarehouseId })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [clearedWarehouseStock, setClearedWarehouseStock] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { data: transaksiData } = useGetTransaksisQuery()
  const { data: returnData } = useGetReturnssQuery()
  console.log({ returnData })

  const { data: mutasi } = useGetWarehouseTransfersQuery()
  const { data: stokBaku } =
    useAmbilDetailBarangGoretsGudangdanQuery(selectedWarehouseId)
  const filteredWarehouseStocks =
    stokBaku?.filter((item) => item?.stock != null) || []

  console.log({ filteredWarehouseStocks })

  // const { warehouseStock } = useWarehouseStock(
  //   selectedDate || '',
  //   selectedWarehouseId || 0
  // )
  const totalQtyTerjual = useMemo(() => {
    if (!transaksiData || !selectedWarehouseId) return {}
    const qtyByFinanceAccount: Record<number, number> = {}
    transaksiData
      .filter(
        (transaksi: any) =>
          transaksi.trans_date === selectedDate &&
          transaksi.reason_id === 'unvoid' &&
          // transaksi.jalur === 'returning' &&
          transaksi.warehouse_id === selectedWarehouseId
      )
      .forEach((transaksi: any) => {
        transaksi.items.forEach((item: any) => {
          const finance_account_id = item.finance_account_id as number
          const qty = item.qty as number
          if (!qtyByFinanceAccount[finance_account_id]) {
            qtyByFinanceAccount[finance_account_id] = 0
          }
          qtyByFinanceAccount[finance_account_id] += qty
        })
      })
    return qtyByFinanceAccount
  }, [transaksiData, selectedDate, selectedWarehouseId])

  const totalQtyReturn = useMemo(() => {
    if (!returnData || !selectedWarehouseId) return {}
    const qtyByFinanceAccount: Record<number, number> = {}
    returnData
      .filter(
        (transaksi: any) =>
          transaksi.trans_date === selectedDate &&
          transaksi.jalur === 'returning' &&
          transaksi.warehouse_id === selectedWarehouseId
      )
      .forEach((transaksi: any) => {
        transaksi.items.forEach((item: any) => {
          const finance_account_id = item.finance_account_id as number
          const qty = item.qty as number
          if (!qtyByFinanceAccount[finance_account_id]) {
            qtyByFinanceAccount[finance_account_id] = 0
          }
          qtyByFinanceAccount[finance_account_id] += qty
        })
      })
    return qtyByFinanceAccount
  }, [returnData, selectedDate, selectedWarehouseId])
  console.log({ totalQtyReturn })
  const totalMutasiMasuk = useMemo(() => {
    if (!mutasi) return {}
    const qtyByProductId: Record<number, number> = {}
    mutasi
      .filter(
        (mutasi: any) =>
          mutasi.trans_date === selectedDate &&
          mutasi.to_warehouse_id === selectedWarehouseId
      )
      .forEach((mutasi: any) => {
        mutasi.items.forEach((item: any) => {
          const product_id = item.product_id as number
          const qty = item.qty as number
          if (!qtyByProductId[product_id]) {
            qtyByProductId[product_id] = 0
          }
          qtyByProductId[product_id] += qty
        })
      })
    return qtyByProductId
  }, [mutasi, selectedDate, selectedWarehouseId])
  const totalMutasiKeluar = useMemo(() => {
    if (!mutasi) return {}
    const qtyByProductId: Record<number, number> = {}
    mutasi
      .filter(
        (mutasi: any) =>
          mutasi.trans_date === selectedDate &&
          mutasi.from_warehouse_id === selectedWarehouseId
      )
      .forEach((mutasi: any) => {
        mutasi.items.forEach((item: any) => {
          const product_id = item.product_id as number
          const qty = item.qty as number
          if (!qtyByProductId[product_id]) {
            qtyByProductId[product_id] = 0
          }
          qtyByProductId[product_id] += qty
        })
      })
    return qtyByProductId
  }, [mutasi, selectedDate, selectedWarehouseId])

  useEffect(() => {
    setClearedWarehouseStock([])
  }, [selectedWarehouseId])

  const handleWarehouseChange = (value: number) => {
    setSelectedWarehouseId(value)
  }

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase())
  }
  // const filteredWarehouseStock =
  //   stokBaku?.filter(
  //     (item) =>
  //       item.stock > 0 &&
  //       (selectedWarehouseId === null ||
  //         item.warehouse_id === selectedWarehouseId)
  //   ) || []
  const filteredWarehouseStock =
    stokBaku?.filter(
      (item) =>
        item.stock > 0 &&
        (selectedWarehouseId === null ||
          item.warehouse_id === selectedWarehouseId) &&
        (item.id.toString().includes(searchTerm) ||
          item.name.toLowerCase().includes(searchTerm))
    ) || []

  const navigate = useNavigate()

  const [poValues, setPoValues] = useState<{ [key: number]: number }>({})

  const handlePoChange = (value: string, recordId: number) => {
    const numericValue = parseInt(value, 10) || 0
    setPoValues((prevPoValues) => ({
      ...prevPoValues,
      [recordId]: numericValue,
    }))
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
      title: 'Product ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate(`/product-history/${id}`)}
        >
          {id}
        </span>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Penjualan',
      key: 'totalQtyTerjual',
      render: (text: any, record: any) => totalQtyTerjual[record.id] || 0,
    },
    {
      title: 'Mutasi Keluar',
      key: 'totalMutasiKeluar',
      render: (text: any, record: any) => totalMutasiKeluar[record.id] || 0,
    },
    {
      title: 'Mutasi Masuk',
      key: 'totalMutasiMasuk',
      render: (text: any, record: any) => totalMutasiMasuk[record.id] || 0,
    },
    {
      title: 'Return',
      key: 'totalQtyReturn',
      render: (text: any, record: any) => totalQtyReturn[record.id] || 0,
    },

    // {
    //   title: 'Stok Terupdate',
    //   key: 'stokTerupdate',
    //   render: (text: any, record: any) => {
    //     const stock = record.stock || 0
    //     const penjualan = totalQtyTerjual[record.id] || 0
    //     const mutasi = totalMutasiKeluar[record.id] || 0
    //     const mutasiMasuk = totalMutasiMasuk[record.id] || 0
    //     const returning = totalQtyReturn[record.id] || 0
    //     // const stokMaxs = stokMax[record.id] || 0
    //     const stokTerupdate =
    //       stock + returning + mutasiMasuk - penjualan - mutasi
    //     return stokTerupdate
    //   },
    // },
    {
      title: 'Stok Terupdate',
      key: 'stokTerupdate',
      render: (text: any, record: any) => {
        const stock = record.stock || 0
        const penjualan = totalQtyTerjual[record.id] || 0
        const mutasiKeluar = totalMutasiKeluar[record.id] || 0
        const mutasiMasuk = totalMutasiMasuk[record.id] || 0
        const returning = totalQtyReturn[record.id] || 0
        const po = poValues[record.id] || 0

        const stokTerupdate =
          stock + returning + mutasiMasuk - penjualan - mutasiKeluar - po
        return stokTerupdate
      },
    },
    {
      title: 'PO',
      key: 'po',
      render: (text: any, record: any) => (
        <Input
          type="number"
          value={poValues[record.id] || 0}
          onChange={(e) => handlePoChange(e.target.value, record.id)}
        />
      ),
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
          placeholder="Cari Barang"
          style={{ width: '70%', marginTop: 16 }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Col>

      <Table
        dataSource={
          filteredWarehouseStock.length
            ? filteredWarehouseStock
            : clearedWarehouseStock
        }
        columns={columns}
        rowKey="id"
        pagination={true}
        rowClassName={(record) => {
          const stock = record.stock || 0

          const penjualan = totalQtyTerjual[record.id] || 0
          const mutasi = totalMutasiKeluar[record.id] || 0
          const mutasiMasuk = totalMutasiMasuk[record.id] || 0

          const returning = totalQtyReturn[record.id] || 0
          const stokTerupdate =
            stock + mutasiMasuk + returning - penjualan - mutasi
          return stokTerupdate < 0 ? 'negative-stock-row' : ''
        }}
      />
    </div>
  )
}

export default LaporanStock

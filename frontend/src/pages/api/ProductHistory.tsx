import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { Table, message } from 'antd'
import { useGetTransaksisQuery } from '../../hooks/transactionHooks'
import { useGetWarehouseTransfersQuery } from '../../hooks/pindahHooks'
import { useWarehouseStock } from './fetchSemuaStok'

type LocationState = {
  transaksiData?: any[]
  mutasi?: any[]
  warehouseStock?: any[]
  productId?: string
}

const ProductHistory = () => {
  const location = useLocation()
  const state = location.state as LocationState
  const { id } = useParams<{ id: string }>()

  const [productTransactions, setProductTransactions] = useState<any[]>([])

  const [productMutasi, setProductMutasi] = useState<any[]>([])

  const [productStock, setProductStock] = useState<any>(null)
  const { data: transaksiData = [] } = useGetTransaksisQuery()
  const { data: mutasi = [] } = useGetWarehouseTransfersQuery()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any>('0')

  const { warehouseStock = [] } = useWarehouseStock(
    selectedDate || '',
    selectedWarehouseId
  )
  useEffect(() => {
    const productId = state?.productId || id
    const numericProductId = Number(productId)
    // const transactions = state?.transaksiData || transaksiData
    // const filteredTransactions = transactions.flatMap((transaction) => {
    //   const filteredItems = transaction.items.filter(
    //     (item: any) => item.finance_account_id === numericProductId
    //   )
    //   return filteredItems
    // })
    // const transfers = state?.mutasi || mutasi
    // const filteredMutasi = transfers.flatMap((mutasi) => {
    //   const filteredItems = mutasi.items.filter(
    //     (mutasi: any) => mutasi.product_id === numericProductId
    //   )
    //   return filteredItems
    // })

    const transactions = state?.transaksiData || transaksiData
    const filteredTransactions = transactions.flatMap((transaction) => {
      const filteredItemsJual = transaction.items
        .filter((item: any) => item.finance_account_id === numericProductId)
        .map((item: any) => ({
          ...item, // Data di dalam items
          jalur: transaction.jalur, // Data di luar items
          noInvoicePenjualan: transaction.ref_number, // Ambil ID transaksi jika ada
          objectSelling: transaction.contact_id, // Ambil ID transaksi jika ada
        }))

      return filteredItemsJual
    })

    const transfers = state?.mutasi || mutasi
    const filteredMutasi = transfers.flatMap((mutasi) => {
      const filteredItemsMutasi = mutasi.items
        .filter((item: any) => item.product_id === numericProductId)
        .map((item: any) => ({
          ...item, // Data di dalam items
          tujuan: mutasi.to_warehouse_id, // Data di luar items
          noInvoiceTransfer: mutasi.ref_number, // Ambil ID transaksi jika ada
          objectTransfer: mutasi.to_warehouse_id, // Ambil ID transaksi jika ada
        }))

      return filteredItemsMutasi
    })

    console.log({ transfers })

    const stockData = state?.warehouseStock || warehouseStock
    const currentStock = stockData.find((s) => s.id === productId)

    setProductTransactions(filteredTransactions)
    setProductMutasi(filteredMutasi)
    setProductStock(currentStock)
  }, [state, transaksiData, mutasi, warehouseStock, id])
  const combinedData = [
    ...productTransactions.map((transaction) => ({
      key: transaction._id || `penjualan-${transaction.trans_date}`,
      jenisInvoice: 'Penjualan',
      qty: transaction.qty,
      trans_date: transaction.trans_date,
      ref_number: transaction.noInvoicePenjualan, // Use ref_number for Penjualan
      target: transaction.objectSelling, // Use ref_number for Penjualan
    })),
    ...productMutasi.map((mutasi) => ({
      key: mutasi._id || `transfer-${mutasi.trans_date}`,
      jenisInvoice: 'Mutasi',
      qty: mutasi.qty_minta,
      trans_date: mutasi.trans_date,
      ref_number: mutasi.noInvoiceTransfer, // Use ref_number for Transfer
      target: mutasi.objectTransfer, // Use ref_number for Penjualan
    })),
  ]

  console.log({ combinedData })
  return (
    <div>
      <h2>History for Product ID: {state?.productId || id}</h2>
      <Table
        dataSource={combinedData}
        columns={[
          {
            title: 'Jenis Transaksi',
            dataIndex: 'jenisInvoice',
            key: 'jenisInvoice',
          },
          {
            title: 'Reference Number',
            dataIndex: 'ref_number',
            key: 'ref_number',
          },
          {
            title: 'Ekeskutor',
            dataIndex: 'target',
            key: 'target',
          },
          {
            title: 'Quantity',
            dataIndex: 'qty',
            key: 'qty',
          },
        ]}
        rowKey="key"
      />

      <p>Current Stock: {productStock?.stock || 0}</p>
    </div>
  )
}

export default ProductHistory

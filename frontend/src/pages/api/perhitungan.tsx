import React from 'react'
import { Table } from 'antd'
import { useGetPerhitunganQuery } from '../../hooks/perhitunganHooks'

const PerhitunganComponent: React.FC = () => {
  const { data, error, isLoading } = useGetPerhitunganQuery()

  if (isLoading) return <div>Loading...</div>

  // Periksa apakah data adalah array
  if (!data || !Array.isArray(data)) {
    console.error('Data:', data) // Menampilkan data di konsol untuk debug
    return <div>Error: Data tidak valid</div>
  }

  const columns = [
    {
      title: 'ID Barang',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Total Qty',
      dataIndex: 'totalQty',
      key: 'totalQty',
    },
  ]

  return (
    <div>
      <h1>Data Agregasi Perhitungan</h1>
      <Table dataSource={data} columns={columns} rowKey="_id" />
    </div>
  )
}

export default PerhitunganComponent

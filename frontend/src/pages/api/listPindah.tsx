import React, { useContext } from 'react'
import { Table } from 'antd'
import { useGetWarehouseTransfersQuery } from '../../hooks/pindahHooks'
import { useIdWarehouse } from './namaWarehouse'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'

const WarehouseTransferTable: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = 0
  if (user) {
    idOutletLoggedIn = Number(user.id_outlet)
  }

  const { data: transfers } = useGetWarehouseTransfersQuery()
  const { idWarehouse } = useIdWarehouse()
  const navigate = useNavigate()

  const warehouseMap = React.useMemo(() => {
    const map: Record<number, string> = {}
    idWarehouse.forEach((warehouse) => {
      map[warehouse.id] = warehouse.name
    })
    return map
  }, [idWarehouse])

  // Filter transfers and sort by createdAt in descending order
  const dataSource = Array.isArray(transfers)
    ? transfers
        .filter(
          (transfer: any) => transfer.from_warehouse_id === idOutletLoggedIn
        )
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    : []

  const handleRowClick = (record: any) => {
    navigate(`/transfer-detail/${record.ref_number}`)
  }

  const columns = [
    {
      title: 'Dari',
      dataIndex: 'from_warehouse_id',
      key: 'from_warehouse_id',
      render: (id: number) => warehouseMap[id] || id,
    },
    {
      title: 'Tujuan',
      dataIndex: 'to_warehouse_id',
      key: 'to_warehouse_id',
      render: (id: number) => warehouseMap[id] || id,
    },
    {
      title: 'INV',
      dataIndex: 'ref_number',
      key: 'ref_number',
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: 'Tanggal',
      dataIndex: 'trans_date',
      key: 'trans_date',
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="ref_number"
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })}
    />
  )
}

export default WarehouseTransferTable

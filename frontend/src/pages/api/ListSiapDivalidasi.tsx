import React, { useContext, useState } from 'react'
import { Button, Input, Table } from 'antd'
import { useGetWarehouseTransfersQuery } from '../../hooks/pindahHooks'
import { useIdWarehouse } from './namaWarehouse'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'

const ListSiapDiValidasi: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = 0
  if (user) {
    idOutletLoggedIn = Number(user.id_outlet)
  }
  console.log({ idOutletLoggedIn })
  const { data: transfers } = useGetWarehouseTransfersQuery()
  console.log({ transfers })

  const { idWarehouse } = useIdWarehouse()
  const navigate = useNavigate()

  const warehouseMap = React.useMemo(() => {
    const map: Record<number, string> = {}
    idWarehouse.forEach((warehouse) => {
      map[warehouse.id] = warehouse.name
    })
    return map
  }, [idWarehouse])
  console.log({ warehouseMap })

  const [searchTerm, setSearchTerm] = useState('')

  // const userContext = useContext(UserContext)
  // const { user } = userContext || {}
  // let idOutletLoggedIn = 0
  // if (user) {
  //   idOutletLoggedIn = Number(user.id_outlet)
  // }

  const dataSource = Array.isArray(transfers)
    ? transfers
        .filter((transfer: any) => {
          const refNumber = String(transfer.ref_number || '')
          const fromWarehouseId = String(transfer.to_warehouse_id || '')

          // Syarat umum untuk semua pengguna
          const isCommonCriteriaMet =
            transfer.to_warehouse_id !== idOutletLoggedIn &&
            transfer.code === 1 &&
            (refNumber.includes(searchTerm) ||
              fromWarehouseId.includes(searchTerm))

          // Admin memiliki akses penuh jika syarat umum terpenuhi
          if (user?.isAdmin) {
            return isCommonCriteriaMet
          }

          // Non-admin hanya dapat melihat data tertentu
          return (
            isCommonCriteriaMet &&
            transfer.from_warehouse_id === idOutletLoggedIn // Contoh syarat tambahan untuk non-admin
          )
        })
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    : []

  const handleRowClick = (record: any) => {
    navigate(`/validasi-pindah/${record.ref_number}`)
  }
  const [activeButton, setActiveButton] = useState('')

  const handleButtonClick = (value: any) => {
    setActiveButton(value)

    if (value === '1') {
      navigate('/listsiapvalidasi')
    } else if (value === '2') {
      navigate('/listsudahdivalidasikeluar')
    } else if (value === '3') {
      navigate('/ListSudahValidasiMasuk')
    }
  }
  const columns = [
    // {
    //   title: 'Dari',
    //   dataIndex: 'to_warehouse_id',
    //   key: 'to_warehouse_id',
    //   render: (id: number) => warehouseMap[id] || id,
    // },
    {
      title: 'Tujuan',
      dataIndex: 'from_warehouse_id',
      key: 'from_warehouse_id',
      render: (id: number) => warehouseMap[id] || id,
    },
    {
      title: 'Dari',
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
    <>
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Pencarian No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }} // Adjust width as needed
        />
      </div>

      <Button
        id="btn-filter-1"
        value="1"
        type="default"
        className={activeButton === '1' ? 'btn-default-selected' : ''}
        style={{ borderRadius: '0px' }}
        onClick={() => handleButtonClick('1')}
      >
        <span>Validasi Permintaan</span>
      </Button>
      <Button
        id="btn-filter-2"
        value="2"
        type="default"
        className={activeButton === '2' ? 'btn-default-selected' : ''}
        style={{ borderRadius: '0px' }}
        onClick={() => handleButtonClick('2')}
      >
        <span>Sudah Divalidasi Keluar</span>
      </Button>
      <Button
        id="btn-filter-1"
        value="1"
        type="default"
        className={activeButton === '3' ? 'btn-default-selected' : ''}
        style={{ borderRadius: '0px' }}
        onClick={() => handleButtonClick('3')}
      >
        <span>Sudah Divalidasi Masuk</span>
      </Button>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="ref_number"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </>
  )
}

export default ListSiapDiValidasi

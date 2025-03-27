import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Select, Col, Table, Input } from 'antd'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import SingleDate from '../SingleDate'
import { useGetTransaksisQuery } from '../../hooks/transactionHooks'
import { useNavigate } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import { useGetContactsQuery } from '../../hooks/contactHooks'

const LaporanKeuangan = () => {
  const { data: gudangdb } = useGetWarehousesQuery()
  const { data: transaksiData } = useGetTransaksisQuery()
  const navigate = useNavigate()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const idOutletLoggedIn = user ? Number(user.id_outlet) : 0

  const [selectedWarehouseId, setSelectedWarehouseId] =
    useState<number>(idOutletLoggedIn)

  useEffect(() => {
    if (idOutletLoggedIn !== 0) {
      setSelectedWarehouseId(idOutletLoggedIn)
    }
  }, [idOutletLoggedIn])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [clearedWarehouseStock, setClearedWarehouseStock] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

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

  const filteredWarehouseStock = useMemo(() => {
    const paymentSummary: Record<
      number,
      { totalDownPayment: number; totalAmount: number }
    > = {}

    transaksiData?.forEach((item: any) => {
      if (
        item.warehouse_id > 0 &&
        item.trans_date === selectedDate &&
        item.reason_id === 'unvoid'
      ) {
        const downPayment = item.witholdings.reduce(
          (sum: any, witholding: any) => sum + (witholding.down_payment || 0),
          0
        )

        if (!paymentSummary[item.warehouse_id]) {
          paymentSummary[item.warehouse_id] = {
            totalDownPayment: 0,
            totalAmount: 0,
          }
        }
        paymentSummary[item.warehouse_id].totalDownPayment += downPayment
        paymentSummary[item.warehouse_id].totalAmount += item.amount || 0
      }
    })

    return (
      Object.keys(paymentSummary)
        .filter(
          (warehouseId: any) =>
            selectedWarehouseId === null ||
            parseInt(warehouseId) === selectedWarehouseId
        )
        .map((warehouseId: any) => ({
          warehouse_id: parseInt(warehouseId),
          totalDownPayment: paymentSummary[warehouseId].totalDownPayment,
          totalAmount: paymentSummary[warehouseId].totalAmount,
        })) || []
    )
  }, [transaksiData, selectedDate, selectedWarehouseId])
  const { data: contacts } = useGetContactsQuery()
  const [searchText, setSearchText] = useState<string>('') // State untuk teks pencarian

  // Filter kontak berdasarkan teks pencarian
  const filteredContacts = useMemo(() => {
    return contacts?.filter((contact) =>
      contact.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [contacts, searchText])

  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Warehouse ID',
      dataIndex: 'warehouse_id',
      key: 'warehouse_id',
      render: (warehouse_id: number) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() =>
            navigate(
              `/laporankelisttransaksi?warehouse_id=${warehouse_id}&date=${selectedDate}`
            )
          }
        >
          {warehouse_id}
        </span>
      ),
    },
    {
      title: 'Total Down Payment',
      dataIndex: 'totalDownPayment',
      key: 'totalDownPayment',
      render: (totalDownPayment: number) => (
        <div style={{ textAlign: 'right' }}>
          {`Rp ${totalDownPayment.toLocaleString()}`}
        </div>
      ),
    },
    {
      title: 'Piutang',
      key: 'piutang',
      render: (record: any) => {
        const piutang = record.totalAmount - record.totalDownPayment
        return (
          <div style={{ textAlign: 'right' }}>
            {`Rp ${piutang.toLocaleString()}`}
          </div>
        )
      },
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (totalAmount: number) => (
        <div style={{ textAlign: 'right' }}>
          {`Rp ${totalAmount.toLocaleString()}`}
        </div>
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
          disabled={!user?.isAdmin}
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
      {/* <Table
        dataSource={
          filteredWarehouseStock.length
            ? filteredWarehouseStock
            : clearedWarehouseStock
        }
        columns={columns}
        rowKey="warehouse_id"
        pagination={true}
      /> */}
      <Input
        placeholder="Cari Nama Kontak"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '1rem', width: '300px' }}
      />
      <Table
        dataSource={
          filteredWarehouseStock.length
            ? filteredWarehouseStock
            : clearedWarehouseStock
        }
        columns={columns}
        rowKey="warehouse_id"
        summary={(pageData) => {
          let totalAmount = 0
          let totalDownPayment = 0
          let totalPiutang = 0

          pageData.forEach(
            ({ totalAmount: amount, totalDownPayment: downPayment }) => {
              totalAmount += amount
              totalDownPayment += downPayment
              totalPiutang += amount - downPayment
            }
          )

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <div style={{ textAlign: 'left' }}>
                  <strong>Total</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalDownPayment.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalAmount.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalPiutang.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </div>
  )
}

export default LaporanKeuangan

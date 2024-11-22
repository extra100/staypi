import React, { useState } from 'react'
import { Table, DatePicker, Row, Col, Typography, Select } from 'antd'
import moment from 'moment'
import { TakeInvoicesFromKledoBasedOnDate } from '../takeInvoiceFromKledoBasedOnDate'
import { formatDate } from './FormatDate'
import { useGetFilteredTransaksisQuery } from '../../hooks/transactionHooks'

const { Title } = Typography
const { Option } = Select

const SuitExApiWithOwnDbBasedDate: React.FC = () => {
  const [transDateFrom, setTransDateFrom] = useState<string | null>(null)
  const [transDateTo, setTransDateTo] = useState<string | null>(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)

  const { loading, getInvFromKledoBasedDate } =
    TakeInvoicesFromKledoBasedOnDate(
      transDateFrom,
      transDateTo,
      selectedWarehouse
    )
  console.log({ getInvFromKledoBasedDate })
  const { data: filteredTransaksis, isLoading: loadingOwnDb } =
    useGetFilteredTransaksisQuery({
      transDateFrom,
      transDateTo,
      selectedWarehouse,
    })
  console.log({ filteredTransaksis })

  const handleDateFromChange = (date: moment.Moment | null) => {
    setTransDateFrom(date ? date.format('YYYY-MM-DD') : null)
  }

  const handleDateToChange = (date: moment.Moment | null) => {
    setTransDateTo(date ? date.format('YYYY-MM-DD') : null)
  }

  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value)
  }

  const handleStatusChange = (value: number) => {
    setSelectedStatus(value)
  }

  const columns = [
    {
      title: 'No',
      key: 'no',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'ID Unique (From Kledo)',
      dataIndex: 'id_kledo',
      key: 'id_kledo',
      ellipsis: true,
    },
    {
      title: 'ID Unique (From Database)',
      dataIndex: 'id_own_db',
      key: 'id_own_db',
      ellipsis: true,
    },
    {
      title: 'Inv',
      dataIndex: 'ref_number',
      key: 'ref_number',
      ellipsis: true,
    },
    {
      title: 'Tanggal Transaksi',
      dataIndex: 'trans_date',
      key: 'trans_date',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Gudang',
      dataIndex: 'warehouse_id',
      key: 'warehouse_name',
      ellipsis: true,
    },
  ]

  const checkIfRowIsRed = (rowId: string) => {
    const matchingRow = filteredTransaksis?.find(
      (transaksi: any) => transaksi.id === rowId
    )
    return matchingRow ? false : true
  }

  const combinedData = getInvFromKledoBasedDate?.map((row: any) => {
    const matchingRow = filteredTransaksis?.find(
      (transaksi) => transaksi.id === row.id
    )
    const isRed = matchingRow ? false : true
    return {
      ...row,
      id_kledo: row.id,
      id_own_db: matchingRow?.id,
      isRed,
    }
  })

  return (
    <div style={{ width: '800px', margin: '0 auto', padding: '20px' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <Title level={4}>
            Filter Data Faktur Berdasarkan Tanggal, Gudang, dan Status
          </Title>
        </Col>
        <Col span={6}>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={handleDateFromChange as any}
            placeholder="Dari Tanggal"
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={6}>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={handleDateToChange as any}
            placeholder="Sampai Tanggal"
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Pilih Gudang"
            onChange={handleWarehouseChange}
            style={{ width: '100%' }}
          >
            <Option value="18">Warehouse 1</Option>
            <Option value="10">Warehouse 2</Option>
          </Select>
        </Col>
      </Row>
      <Table
        dataSource={combinedData}
        columns={columns}
        rowKey="id"
        loading={loading || loadingOwnDb}
        pagination={{ pageSize: 100 }}
        style={{ marginTop: '20px' }}
        rowClassName={(record) => (record.isRed ? 'red-row' : '')}
      />
    </div>
  )
}

export default SuitExApiWithOwnDbBasedDate

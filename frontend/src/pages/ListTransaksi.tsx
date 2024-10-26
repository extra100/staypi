import React, { useEffect, useState } from 'react'
import { DatePicker, Button, Table, Spin, Alert, Select } from 'antd'
import dayjs from 'dayjs'
import { useFetchTransactions } from '../hooks/transaksiPolosanHooks'

const { RangePicker } = DatePicker
const { Option } = Select

const TransactionList: React.FC = () => {
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [warehouseId, setWarehouseId] = useState<string | null>(null)

  const startDate = dates?.[0]?.format('DD-MM-YYYY') || ''
  const endDate = dates?.[1]?.format('DD-MM-YYYY') || ''
  const [tableData, setTableData] = useState<any[]>([])
  console.log({ tableData })

  const {
    data: transactions,
    error,
    isLoading,
  } = useFetchTransactions(startDate, endDate, warehouseId || '')
  console.log({ transactions })

  useEffect(() => {
    if (transactions) {
      console.log('Updating table data:', transactions)
      setTableData(transactions)
    }
  }, [transactions])
  const columns = [
    {
      title: 'No',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Outlet',
      dataIndex: 'items',
      key: 'items',
      render: (items: any) => {
        if (Array.isArray(items)) {
          return items.map((tag) => tag.discount_percent)
        }
        return ''
      },
    },

    {
      title: 'Transaction Date',
      dataIndex: 'trans_date',
      key: 'trans_date',
    },

    {
      title: 'Contact ID',
      dataIndex: 'nama_pelanggan',
      key: 'nama_pelanggan',
    },
    // {
    //   title: 'diskon',
    //   dataIndex: 'items',
    //   key: 'items',
    // },
  ]

  return (
    <div>
      <RangePicker
        onChange={setDates as any}
        format="DD-MM-YYYY"
        style={{ marginBottom: 16 }}
      />

      <Select
        placeholder="Select Warehouse"
        showSearch
        onChange={(value) => setWarehouseId(value)}
        style={{ width: 200, marginBottom: 16, marginRight: 16 }}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((id) => (
          <Option key={id} value={id.toString()}>
            Warehouse {id}
          </Option>
        ))}
      </Select>

      <Button
        type="primary"
        disabled={!startDate || !endDate || !warehouseId}
        style={{ marginBottom: 16 }}
      >
        Fetch Transactions
      </Button>

      {isLoading && <Spin tip="Loading..." />}
      {error && (
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      )}

      <Table
        dataSource={tableData} // Gunakan tableData sebagai sumber data tabel
        columns={columns}
        rowKey="_id" // Pastikan ini sesuai dengan key unik transaksi
        pagination={false}
      />
    </div>
  )
}

export default TransactionList

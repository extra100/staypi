import React, { useEffect, useState } from 'react'
import { DatePicker, Button, Table, Spin, Alert, Select } from 'antd'
import dayjs from 'dayjs'
import { useFetchBarangSold } from '../../hooks/soldBarangHooks'

const { RangePicker } = DatePicker
const { Option } = Select

const BarangSold: React.FC = () => {
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [warehouseId, setWarehouseId] = useState<number | null>(null)

  const startDate = dates?.[0]?.format('DD-MM-YYYY') || ''
  const endDate = dates?.[1]?.format('DD-MM-YYYY') || ''
  const [tableData, setTableData] = useState<any[]>([])

  const {
    data: barangSold,
    error,
    isLoading,
  } = useFetchBarangSold(startDate, endDate, warehouseId || 0)

  useEffect(() => {
    if (barangSold) {
      setTableData(barangSold)
    }
  }, [barangSold])

  const columns = [
    {
      title: 'Finance Account ID',
      dataIndex: 'finance_account_id',
      key: 'finance_account_id',
    },
    {
      title: 'Warehouse Name',
      dataIndex: 'contact_id',
      key: 'contact_id',
    },
    {
      title: 'Total Qty',
      dataIndex: 'totalQty',
      key: 'totalQty',
    },
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
          <Option key={id} value={id}>
            Warehouse {id}
          </Option>
        ))}
      </Select>

      <Button
        type="primary"
        disabled={!startDate || !endDate || !warehouseId}
        style={{ marginBottom: 16 }}
      >
        Fetch barangSold
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
        rowKey={(record) => `${record.finance_account_id}`} // Pastikan ini unik
        pagination={true}
      />
    </div>
  )
}

export default BarangSold

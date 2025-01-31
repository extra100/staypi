import React, { useState, useMemo } from 'react'
import { DatePicker, Spin, Table, Select } from 'antd'
import dayjs from 'dayjs'
import { useSalesData } from './OutletSebelas'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'

export function SalesPerProductCategoryUI() {
  const [dates, setDates] = useState<[string, string]>([ 
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ])
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>(undefined) // State untuk memilih gudang
  const outletIds = Array.from({ length: 21 }, (_, index) => index + 2).filter(
    (outletId) => outletId !== 4
  )

  const salesDataByOutlet = outletIds.map((outletId) => useSalesData(dates[0], dates[1], outletId))
  const { data: gudangs } = useGetWarehousesQuery()

  const loadingState = salesDataByOutlet.map(({ loading }) => loading)

  const allCategories = useMemo(() => {
    return Array.from(
      new Set(
        salesDataByOutlet.flatMap(({ salesData }) => salesData.map((item) => item.category_name))
      )
    )
  }, [salesDataByOutlet])

  const columns = [
    {
      title: 'OUTLET',
      dataIndex: 'warehouseId',
      key: 'warehouseId',
      className: 'no-padding',
      align: 'center', // Align the content to the center
    },
    ...allCategories.map((category) => ({
      title: category,
      dataIndex: category,
      key: category,
      className: 'no-padding',
      render: (value: any) => value.toLocaleString(), // No bold
    })),
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: 'no-padding',
      render: (value: any) => <b>{value.toLocaleString()}</b>,
    },
  ]

  // Generate data untuk setiap gudang
  const dataSource = outletIds.map((outletId, index) => {
    const { salesData } = salesDataByOutlet[index] || { salesData: [] }

    const warehouse = gudangs?.find((gudang) => gudang.id === outletId)
    const warehouseName = warehouse ? warehouse.name : `Gudang ${outletId}`

    const rowData: any = { key: outletId.toString(), warehouseId: warehouseName }

    let totalPerOutlet = 0

    allCategories.forEach((category) => {
      const categorySales = salesData.find((item) => item.category_name === category)
      const value = categorySales ? categorySales.amount_after_tax || 0 : 0
      rowData[category] = value
      totalPerOutlet += value
    })

    rowData.total = totalPerOutlet

    return rowData
  })

  // Filter dataSource berdasarkan gudang yang dipilih
  const filteredDataSource = selectedWarehouse
    ? dataSource.filter((row) => row.warehouseId === selectedWarehouse)
    : dataSource

  // Hitung total per kategori (total per kolom)
  const totalPerCategory: any = { key: 'total', warehouseId: <b>Total Semua</b> }
  let grandTotal = 0

  allCategories.forEach((category) => {
    const total = filteredDataSource.reduce((acc, row) => acc + (row[category] || 0), 0)
    totalPerCategory[category] = <b>{total.toLocaleString()}</b>
    grandTotal += total
  })

  totalPerCategory.total = <b>{grandTotal.toLocaleString()}</b>

  return (
    <div>
      <h2>Pencapaian Omset Kategori Barang</h2>
      <br />
      <DatePicker.RangePicker
        onChange={(values) => {
          if (values?.[0] && values?.[1]) {
            setDates([values[0].format('YYYY-MM-DD'), values[1].format('YYYY-MM-DD')])
          }
        }}
      />
      <Select
        placeholder="Pilih Gudang"
        style={{ width: 200, marginBottom: 16 }}
        onChange={(value) => setSelectedWarehouse(value)}
      
        value={selectedWarehouse}
        
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.children as any)
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      >
        <Select.Option value={undefined}>Semua Gudang</Select.Option>
        {gudangs?.map((gudang) => (
          <Select.Option key={gudang.id} value={gudang.name}>
            {gudang.name}
          </Select.Option>
        ))}
      </Select>
      {loadingState.some((loading) => loading) ? (
        <Spin />
      ) : (
        <Table
          columns={columns as any}
          dataSource={filteredDataSource} // Tampilkan data yang sudah difilter
          pagination={false}
          bordered
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} className="no-padding-summary">
                <b>Total</b>
              </Table.Summary.Cell>
              {allCategories.map((category, index) => (
                <Table.Summary.Cell key={index} index={index + 1} className="no-padding-summary">
                  <b>{totalPerCategory[category]}</b>
                </Table.Summary.Cell>
              ))}
              <Table.Summary.Cell index={allCategories.length + 1} className="no-padding-summary">
                <b>{totalPerCategory.total}</b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      )}
    </div>
  )
}

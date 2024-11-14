import React, { useEffect, useContext, useState, useMemo } from 'react'
import { Button, Table, Tag } from 'antd'
import { useGetTransaksisQuery } from '../../hooks/transactionHooks'
import { useNavigate, useLocation } from 'react-router-dom'
import UserContext from '../../contexts/UserContext'
import { useGetContactsQuery } from '../../hooks/contactHooks'
import { formatDate } from './FormatDate'

const LaporanKeListTransaksi: React.FC = () => {
  const { data: transaksiData } = useGetTransaksisQuery()
  const location = useLocation()
  const navigate = useNavigate()
  // const { currentUser } = useContext(UserContext as any)
  const { data: contacts } = useGetContactsQuery()
  console.log({ contacts })
  const [filteredData, setFilteredData] = useState<any[]>([])

  // Retrieve `warehouse_id` and `date` from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const warehouseId = searchParams.get('warehouse_id')
    const selectedDate = searchParams.get('date')

    if (transaksiData) {
      const filtered = transaksiData.filter((item: any) => {
        return (
          (!warehouseId || item.warehouse_id === parseInt(warehouseId)) &&
          (!selectedDate || item.trans_date === selectedDate)
        )
      })
      setFilteredData(filtered)
    }
  }, [location.search, transaksiData])

  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'ref_number',
      key: 'ref_number',
      render: (text: any, record: any) => (
        <a href={`/detailkledo/${record.ref_number}`}>{text}</a>
      ),
    },
    {
      title: 'Pelanggan',
      dataIndex: 'contact_id',
      key: 'contact_id',
      render: (contactId: any) => {
        const contact = contacts?.find((contact) => contact.id === contactId)
        return contact ? contact.name : 'Pelanggan tidak ditemukan'
      },
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'trans_date',
      key: 'trans_date',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `Rp ${amount.toLocaleString()}`,
    },
    {
      title: 'Terbayar',
      dataIndex: 'witholdings',
      key: 'witholdings',
      render: (witholdings: any[]) => {
        const totalDownPayment = witholdings
          .filter((witholding) => witholding.status === 0)
          .reduce((sum, witholding) => sum + (witholding.down_payment || 0), 0)
        return (
          <div
            style={{ textAlign: 'right' }}
          >{`Rp ${totalDownPayment.toLocaleString()}`}</div>
        )
      },
    },
    {
      title: 'Sisa Tagihan',
      key: 'due',
      render: (record: any) => {
        const totalDownPayment = record.witholdings
          .filter((witholding: any) => witholding.status === 0)
          .reduce(
            (sum: number, witholding: any) =>
              sum + (witholding.down_payment || 0),
            0
          )
        const due = record.amount - totalDownPayment
        return (
          <div
            style={{ textAlign: 'right' }}
          >{`Rp ${due.toLocaleString()}`}</div>
        )
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: any) => {
        const totalDownPayment = record.witholdings.reduce(
          (sum: number, witholding: any) =>
            sum + (witholding.down_payment || 0),
          0
        )
        const due = record.amount - totalDownPayment
        let color = ''
        let text = ''

        if (due === 0) {
          color = 'green'
          text = 'Lunas'
        } else if (totalDownPayment > 0 && due > 0) {
          color = 'orange'
          text = 'Dibayar Sebagian'
        } else {
          color = 'red'
          text = 'Belum Dibayar'
        }

        return <Tag color={color}>{text}</Tag>
      },
    },
  ]

  return (
    <div>
      <h1>Transaction List</h1>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        summary={(pageData) => {
          let totalAmount = 0
          let totalTerbayar = 0
          let totalSisaTagihan = 0

          pageData.forEach(({ amount, witholdings }) => {
            totalAmount += amount
            const totalDownPayment = witholdings
              .filter((witholding: any) => witholding.status === 0)
              .reduce(
                (sum: number, witholding: any) =>
                  sum + (witholding.down_payment || 0),
                0
              )
            totalTerbayar += totalDownPayment
            totalSisaTagihan += amount - totalDownPayment
          })

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalAmount.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalTerbayar.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalSisaTagihan.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} />
            </Table.Summary.Row>
          )
        }}
      />
    </div>
  )
}

export default LaporanKeListTransaksi

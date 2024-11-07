import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Table } from 'antd'

import UserContext from '../../contexts/UserContext'
import { TakeInvoicesFromKledoBasedOnPelanggan } from '../TakeInvoicesFromKledoBasedOnPelanggan'

const DetailPiutangKontak: React.FC = () => {
  const { invoiceBasedOnPelanggan } = TakeInvoicesFromKledoBasedOnPelanggan()
  console.log({ invoiceBasedOnPelanggan })
  const location = useLocation()
  //   const { currentUser } = useContext(UserContext as any)
  //   console.log('Current User ID:', currentUser.id)

  const [filteredData, setFilteredData] = useState<any[]>([])
  console.log({ filteredData })
  const [contactId, setContactId] = useState<any[]>([])
  console.log({ contactId })

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const id = searchParams.get('id')
    console.log({ id })

    if (id) {
      const contactIdNumber = Number(id)
      if (!isNaN(contactIdNumber)) {
        setContactId(contactIdNumber as any)
      }
    }

    if (contactId && invoiceBasedOnPelanggan) {
      const filtered = invoiceBasedOnPelanggan.filter((item: any) => {
        return item.contact?.id === Number(contactId) && item.due !== 0
      })

      const uniqueRefNumbers = filtered.reduce((acc: any[], current: any) => {
        if (!acc.some((item) => item.ref_number === current.ref_number)) {
          acc.push(current)
        }
        return acc
      }, [])

      console.log(
        'Filtered Data with unique ref_number and due !== 0:',
        uniqueRefNumbers
      )
      setFilteredData(uniqueRefNumbers)
    }
  }, [location.search, invoiceBasedOnPelanggan, contactId])

  const columns = [
    {
      title: 'Reference Number',
      dataIndex: 'ref_number',
      key: 'ref_number',
    },
    {
      title: 'Pelanggan',
      dataIndex: ['contact', 'name'],
      key: 'contact.name',
    },

    {
      title: 'Tanggal',
      dataIndex: 'trans_date',
      key: 'trans_date',
    },
    {
      title: 'Invoice Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <div
          style={{ textAlign: 'right' }}
        >{`Rp ${amount.toLocaleString()}`}</div>
      ),
    },
    {
      title: 'Due',
      dataIndex: 'due',
      key: 'due',
      render: (due: number) => (
        <div style={{ textAlign: 'right' }}>{`Rp ${due.toLocaleString()}`}</div>
      ),
    },
  ]

  return (
    <div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="ref_number"
        summary={(pageData) => {
          let totalAmount = 0
          let totalDue = 0

          pageData.forEach(({ amount, due }) => {
            totalAmount += Number(amount)
            totalDue += Number(due)
          })

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={0}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={0} colSpan={3}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalAmount.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={0} colSpan={4}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalDue.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </div>
  )
}

export default DetailPiutangKontak

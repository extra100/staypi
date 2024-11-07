import React, { useState, useEffect, useContext } from 'react'
import { Button, Table, Tag } from 'antd'

import { useGetTransaksisQuery } from '../../hooks/transactionHooks'
import { useIdInvoice } from './takeSingleInvoice'
import UserContext from '../../contexts/UserContext'
import { useGetContactsQuery } from '../../hooks/contactHooks'
import { useLocation, useNavigate } from 'react-router-dom'

const ListTransaksi: React.FC = () => {
  const { data } = useGetTransaksisQuery()
  const location = useLocation()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )
  const { data: contacts } = useGetContactsQuery()

  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(user.id_outlet)
    }
  }, [user])
  const [selectedRefNumber, setSelectedRefNumber] = useState<string | null>(
    null
  )
  const { getIdAtInvoice } = useIdInvoice(selectedRefNumber || '')

  const handleRefNumberClick = (ref_number: string) => {
    setSelectedRefNumber(ref_number)
  }

  const getContactName = (contactId: string) => {
    const contact = contacts?.find((c: any) => c.id === contactId)
    return contact ? contact.name : 'Unknown Contact'
  }

  const filteredData = data
    ?.filter(
      (transaction) =>
        (transaction.warehouse_id === Number(user?.id_outlet) &&
          transaction.jalur === 'penjualan') ||
        (transaction.jalur === 'pemesanan' &&
          transaction.reason_id === 'unvoid')
    )
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  const [activeButton, setActiveButton] = useState('')
  const navigate = useNavigate()
  const handleButtonClick = (value: any) => {
    setActiveButton(value)

    if (value === '1') {
      navigate('/listkledo')
    } else if (value === '2') {
      navigate('/listvoid')
    } else if (value === '3') {
      navigate('/listreturn')
    }
  }
  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'ref_number',
      key: 'ref_number',
      render: (text: any, record: any) => (
        <a
          href={`/detailkledo/${record.ref_number}`}
          onClick={() => handleRefNumberClick(record.ref_number)}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Pelanggan',
      dataIndex: ['contacts', 0, 'id'],
      key: 'contact_name',
      render: (contactId: string) => getContactName(contactId),
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
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <div style={{ textAlign: 'right' }}>{amount}</div>
      ),
    },
    {
      title: 'Terbayar',
      dataIndex: 'witholdings',
      key: 'witholdings',
      render: (witholdings: any[]) => {
        const totalDownPayment = witholdings
          .filter((witholding) => witholding.status === 0)
          .reduce((sum, witholding) => sum + (witholding.down_payment || 0), 0)

        return <div style={{ textAlign: 'right' }}>{totalDownPayment}</div>
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

        return <div style={{ textAlign: 'right' }}>{due}</div>
      },
    },
  ]

  return (
    <>
      <h1>Daftar Transaksi</h1>

      <div id="btn-filter-status-container" style={{ display: 'inline-flex' }}>
        <Button
          id="btn-filter-1"
          value="1"
          type="default"
          className={activeButton === '1' ? 'btn-default-selected' : ''}
          style={{ borderRadius: '0px' }}
          onClick={() => handleButtonClick('1')}
        >
          <span>Semua</span>
        </Button>
      </div>
      <Button
        id="btn-filter-2"
        value="2"
        type="default"
        className={activeButton === '2' ? 'btn-default-selected' : ''}
        style={{ borderRadius: '0px' }}
        onClick={() => handleButtonClick('2')}
      >
        <span>Void</span>
      </Button>
      <Button
        id="btn-filter-3"
        value="3"
        type="default"
        className={activeButton === '3' ? 'btn-default-selected' : ''}
        style={{ borderRadius: '0px' }}
        onClick={() => handleButtonClick('3')}
      >
        <span>Return</span>
      </Button>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
    </>
  )
}

export default ListTransaksi

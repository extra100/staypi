import React, { useState, useEffect, useContext } from 'react'
import { Button, Col, DatePicker, Input, Row, Table, Tag } from 'antd'

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

  const [searchText, setSearchText] = useState<string>('')

  const getContactName = (contact_id: string | number) => {
    const contact = contacts?.find((c) => c.id === contact_id)
    return contact ? contact.name : 'Nama tidak ditemukan'
  }
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  const formatDateForBackend = (dateString: string | null): string => {
    if (!dateString) return ''
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }

  const filteredData = data
    ?.filter((transaction) =>
      searchText
        ? transaction.ref_number
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          getContactName(transaction.contact_id)
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (transaction.memo &&
            transaction.memo.toLowerCase().includes(searchText.toLowerCase()))
        : true
    )
    ?.filter(
      (transaction) =>
        (transaction.warehouse_id === Number(user?.id_outlet) ||
          user?.isAdmin) &&
        transaction.jalur === 'penjualan' &&
        transaction.reason_id !== 'void'
    )
    ?.filter((transaction) => {
      const transDate = new Date(transaction.trans_date)
      const start = startDate ? new Date(formatDateForBackend(startDate)) : null
      const end = endDate ? new Date(formatDateForBackend(endDate)) : null
      return (!start || transDate >= start) && (!end || transDate <= end)
    })
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  // Example of using RangePicker
  ;<DatePicker.RangePicker
    onChange={(dates, dateStrings) => {
      const [start, end] = dateStrings
      setStartDate(start || null)
      setEndDate(end || null)
    }}
  />

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

  const roundUpIndonesianNumber = (value: number | null): string => {
    if (value === null) return ''
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }
  const columns = [
    {
      title: 'No',
      key: 'no',
      render: (_: any, __: any, index: number) => index + 1,
      width: 50,
    },
    {
      title: 'No. Invoice',
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
      title: 'Ket',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: 'Tgl. Trans',
      dataIndex: 'trans_date',
      key: 'trans_date',
      render: (text: any) => formatDate(text), // Apply formatDate here
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

        if (due === 0 || due <= 0) {
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
      align: 'center',
      render: (amount: number) => (
        <div style={{ textAlign: 'right' }}>
          {amount !== undefined ? roundUpIndonesianNumber(amount) : 'Rp 0'}
        </div>
      ),
    },

    {
      title: 'Terbayar',
      dataIndex: 'witholdings',
      key: 'witholdings',
      align: 'center',
      render: (witholdings: any[]) => {
        const totalDownPayment = witholdings
          .filter((witholding) => witholding.status === 0)
          .reduce((sum, witholding) => sum + (witholding.down_payment || 0), 0)

        return (
          <div style={{ textAlign: 'right' }}>
            {totalDownPayment !== undefined
              ? roundUpIndonesianNumber(totalDownPayment)
              : 'Rp 0'}
          </div>
        )
      },
    },
    {
      title: 'Sisa Tagihan',
      key: 'due',
      align: 'center',
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
          <div style={{ textAlign: 'right' }}>
            {roundUpIndonesianNumber(due < 0 ? 0 : due)}
          </div>
        )
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

      <Row gutter={16} style={{ marginBottom: 16, marginTop: 16 }}>
        <Col>
          <DatePicker.RangePicker
            onChange={(dates, dateStrings) => {
              const [start, end] = dateStrings // Destructure the string array
              setStartDate(start || null) // Use `null` if `start` is empty
              setEndDate(end || null) // Use `null` if `end` is empty
            }}
          />
        </Col>
        <Col>
          <DatePicker
            placeholder="Sampai Tanggal"
            format="DD-MM-YYYY"
            onChange={(date, dateString) => setEndDate(dateString)}
          />
        </Col>
        <Col>
          <Input
            placeholder="Cari berdasarkan Ref, Nama Kontak, atau Memo"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </Col>
      </Row>
      <Table
        dataSource={filteredData}
        columns={columns as any}
        rowKey="_id"
        pagination={{ pageSize: 15 }}
      />
    </>
  )
}

export default ListTransaksi

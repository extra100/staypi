import React, { useState, useEffect, useContext } from 'react'
import { Button, Col, DatePicker, Input, Row, Select, Table, Tag } from 'antd'

import { useGetTransaksisQuery } from '../../hooks/transactionHooks'
import { useIdInvoice } from './takeSingleInvoice'
import UserContext from '../../contexts/UserContext'
import { useGetContactsQuery } from '../../hooks/contactHooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetoutletsQuery } from '../../hooks/outletHooks'

const ListTransaksi: React.FC = () => {
  const { data } = useGetTransaksisQuery()
  const location = useLocation()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )
  const { data: contacts } = useGetContactsQuery()
  const { data: gudangs } = useGetoutletsQuery()

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
  //aneh
  const getContactName = (contact_id: string | number) => {
    const contact = contacts?.find((c) => c.id === contact_id)
    return contact ? contact.name : 'Nama tidak ditemukan'
  }
  const getWarehouseName = (warehouse_id: string | number) => {
    const warehouse = gudangs?.find(
      (gudang) => String(gudang.id_outlet) === String(warehouse_id)
    )
    return warehouse ? warehouse.nama_outlet : 'Nama tidak ditemukan'
  }

  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const formatDateForBackend = (dateString: string) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const getStatus = (transaction: any) => {
    const totalDownPayment = transaction.witholdings.reduce(
      (sum: number, witholding: any) => sum + (witholding.down_payment || 0),
      0
    )

    const due = transaction.amount - totalDownPayment

    if (due === 0 || due <= 0) {
      return 'Lunas'
    } else if (totalDownPayment > 0 && due > 0) {
      return 'Dibayar Sebagian'
    } else {
      return 'Belum Dibayar'
    }
  }
  const [searchRef, setSearchRef] = useState('')
  const [searchContact, setSearchContact] = useState<number | undefined>()
  const [searchWarehouse, setSearchWarehouse] = useState<number | undefined>()
  const [searchStatus, setSearchStatus] = useState<string | undefined>()
  const filteredData = data
    ?.filter((transaction) => {

      if (searchRef) {
        return transaction.ref_number
          .toLowerCase()
          .includes(searchRef.toLowerCase())
      }
      return true
    })
    ?.filter((transaction) => {

      if (searchContact) {
        return transaction.contact_id === searchContact
      }
      return true
    })
    ?.filter((transaction) => {

      if (searchWarehouse) {
        return transaction.warehouse_id === searchWarehouse
      }
      return true
    })
    ?.filter((transaction) => {
      if (searchStatus) {
        const statusText = getStatus(transaction)
        return statusText.toLowerCase() === searchStatus.toLowerCase()
      }
      return true
    })
    ?.filter((transaction) => {
      const transDate = new Date(transaction.trans_date)
      const start = startDate ? new Date(formatDateForBackend(startDate)) : null
      const end = endDate ? new Date(formatDateForBackend(endDate)) : null
      return (
        (!start || transDate >= start) &&
        (!end || transDate <= end) &&
        (transaction.warehouse_id === Number(user?.id_outlet) ||
          user?.isAdmin) &&
        transaction.jalur === 'penjualan' &&
        transaction.reason_id !== 'void'
      )
    })
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
      title: 'Outlet',
      dataIndex: 'warehouse_id',
      key: 'warehouse_name',
      render: (warehouseId: number) => getWarehouseName(warehouseId),
    },

    {
      title: 'Ket',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Tgl. Trans',
      dataIndex: 'trans_date',
      key: 'trans_date',
      render: (text: any) => formatDate(text),
    },
    {
      title: 'Tgl. Jatuh Tempo',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (text: any) => formatDate(text),
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
      title: 'Terbayar',
      dataIndex: 'witholdings',
      key: 'witholdings',
      align: 'left',
      render: (witholdings: any[]) => {
        const totalDownPayment = witholdings
          .filter((witholding) => witholding.status === 0)
          .reduce((sum, witholding) => sum + (witholding.down_payment || 0), 0)

        return (
          <div style={{ textAlign: 'left' }}>
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
      align: 'left',
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
          <div style={{ textAlign: 'left' }}>
            {roundUpIndonesianNumber(due < 0 ? 0 : due)}
          </div>
        )
      },
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: number) => (
        <div style={{ textAlign: 'right' }}>
          {amount !== undefined ? roundUpIndonesianNumber(amount) : 'Rp 0'}
        </div>
      ),
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
          <DatePicker
            placeholder="Dari Tanggal"
            format="DD-MM-YYYY"
            onChange={(date, dateString) => {
              if (typeof dateString === 'string') {
                setStartDate(dateString)
              }
            }}
          />
        </Col>
        <Col>
          <DatePicker
            placeholder="Sampai Tanggal"
            format="DD-MM-YYYY"
            onChange={(date, dateString) => {
              if (typeof dateString === 'string') {
                setEndDate(dateString)
              }
            }}
          />
        </Col>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Input
              placeholder="Cari Ref Number"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              style={{ width: 200 }}
            />
          </Col>

          {/* Filter berdasarkan Nama Kontak */}
          <Col>
            <Select
              placeholder="Pilih Nama Kontak"
              value={searchContact}
              onChange={(value) => setSearchContact(value)}
              style={{ width: 200 }}
              allowClear
              showSearch
              optionFilterProp="children" // Enable filtering by the displayed option text
              filterOption={
                (input, option) =>
                  (option?.children as any)
                    .toLowerCase()
                    .includes(input.toLowerCase()) // Custom filter logic
              }
            >
              {contacts?.map((contact) => (
                <Select.Option key={contact.id} value={contact.id}>
                  {contact.name}
                </Select.Option>
              ))}
            </Select>
          </Col>

          {/* Filter berdasarkan Nama Gudang */}
          <Col>
            <Select
              placeholder="Pilih Nama Gudang"
              value={searchWarehouse}
              onChange={(value) => setSearchWarehouse(value)}
              style={{ width: 200 }}
              allowClear
            >
              {gudangs?.map((warehouse) => (
                <Select.Option
                  key={warehouse.id_outlet}
                  value={warehouse.id_outlet}
                >
                  {warehouse.nama_outlet}
                </Select.Option>
              ))}
            </Select>
          </Col>

          {/* Filter berdasarkan Status */}
          <Col>
            <Select
              placeholder="Pilih Status"
              value={searchStatus}
              onChange={(value) => setSearchStatus(value)}
              style={{ width: 200 }}
              allowClear
            >
              <Select.Option value="Lunas">Lunas</Select.Option>
              <Select.Option value="Dibayar Sebagian">
                Dibayar Sebagian
              </Select.Option>
              <Select.Option value="Belum Dibayar">Belum Dibayar</Select.Option>
            </Select>
          </Col>
        </Row>
      </Row>
      {/* <Table
        dataSource={filteredData}
        columns={columns as any}
        rowKey="_id"
        pagination={{ pageSize: 100 }}
      /> */}
      <Table
        dataSource={filteredData}
        columns={columns as any}
        rowKey="id"
        pagination={{ pageSize: 100 }}
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
              <Table.Summary.Cell index={0} colSpan={6}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="right">
                <strong>{`Rp ${roundUpIndonesianNumber(totalAmount)}`}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="right">
                <strong>{`Rp ${roundUpIndonesianNumber(
                  totalTerbayar
                )}`}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={10} align="right">
                <strong>{`Rp ${roundUpIndonesianNumber(
                  totalSisaTagihan
                )}`}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </>
  )
}

export default ListTransaksi

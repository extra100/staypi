import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Table } from 'antd'

import { TakeInvoicesFromKledoBasedOnPelanggan } from '../TakeInvoicesFromKledoBasedOnPelanggan'
import { useGetContactsQuery } from '../../hooks/contactHooks'

import Warehouse from '../transaction/POS/warehouse'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import SingleDate from '../SingleDate'
import { formatDate, formatDateBulan } from './FormatDate'
import { useReactToPrint } from 'react-to-print'

const DetailPiutangKontak = forwardRef<HTMLDivElement>((props, ref) => {
  const navigate = useNavigate()
  const [contactId, setContactId] = useState<number | null>(null)
  const location = useLocation()
  const [filteredData, setFilteredData] = useState<any[]>([])
  const { takeInvoicesFromKledoBasedOnPelanggan } =
    TakeInvoicesFromKledoBasedOnPelanggan(contactId as any)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const id = searchParams.get('id')
    if (id) {
      const contactIdNumber = Number(id)
      if (!isNaN(contactIdNumber)) {
        setContactId(contactIdNumber)
      }
    }

    if (contactId && takeInvoicesFromKledoBasedOnPelanggan) {
      const filtered = takeInvoicesFromKledoBasedOnPelanggan.filter(
        (item: any) => item.contact?.id === contactId
      )

      const uniqueRefNumbers = filtered.reduce((acc: any[], current: any) => {
        if (!acc.some((item) => item.ref_number === current.ref_number)) {
          acc.push(current)
        }
        return acc
      }, [])

      setFilteredData(uniqueRefNumbers)
    }
  }, [location.search, takeInvoicesFromKledoBasedOnPelanggan, contactId])
  const { data: contacts } = useGetContactsQuery()
  const contactName = contacts?.find(
    (contact: any) => contact.id === contactId
  )?.name
  const contactAddress = contacts?.find(
    (contact: any) => contact.id === contactId
  )?.address

  const firstWarehouseId =
    takeInvoicesFromKledoBasedOnPelanggan.length > 0
      ? takeInvoicesFromKledoBasedOnPelanggan[0].warehouse_id
      : null
  const { data: gudangs } = useGetWarehousesQuery()
  const namaGudang = gudangs?.find(
    (contact: any) => contact.id === firstWarehouseId
  )?.name
  const alamatGudang = gudangs?.find(
    (contact: any) => contact.id === firstWarehouseId
  )?.code
  const telpolGudang = gudangs?.find(
    (contact: any) => contact.id === firstWarehouseId
  )?.contact

  const photoGudang = gudangs?.find(
    (contact: any) => contact.id === firstWarehouseId
  )?.photo
  const columns = [
    {
      title: 'No. INV',
      dataIndex: 'ref_number',
      key: 'ref_number',
      ellipsis: true, // Untuk teks panjang
      align: 'left',
    },
    {
      title: 'Tanggal',
      dataIndex: 'trans_date',
      key: 'trans_date',
      align: 'left',

      ellipsis: true,
      render: (value: any) => formatDate(value),
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      ellipsis: true,
      align: 'right',

      render: (value: any) => {
        const validValue =
          !isNaN(value) && value !== null && value !== undefined
            ? Number(value)
            : 0
        return (
          <div style={{ textAlign: 'right' }}>
            {`Rp ${validValue.toLocaleString()}`}
          </div>
        )
      },
    },
    {
      title: 'Progress',
      key: 'progress',
      align: 'right',
      ellipsis: true,
      render: (_: any, record: { due: number; amount: number }) => {
        const due = Number(record.due) || 0
        const amount = Number(record.amount) || 0
        const progress = amount - due

        return (
          <div style={{ textAlign: 'right' }}>
            {`Rp ${progress.toLocaleString()}`}
          </div>
        )
      },
    },
    {
      title: 'Sisa Piutang',
      dataIndex: 'due',
      key: 'due',
      align: 'right',

      ellipsis: true,
      render: (value: any) => (
        <div style={{ textAlign: 'right' }}>
          {`Rp ${Number(value).toLocaleString()}`}
        </div>
      ),
    },
  ]

  const totalDue = filteredData.reduce((acc, item) => acc + item.due, 0)
  const today = new Date()
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const formattedDate = today.toLocaleDateString('id-ID', options)

  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  return (
    <div
      // style={{ width: '800px', margin: '0 auto', paddingRight: '20px' }}
      ref={componentRef}
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '8mm',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px dashed black',
        }}
      >
        <div
          style={{
            width: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {photoGudang ? (
            <img
              src={photoGudang}
              alt="Gudang"
              style={{
                maxWidth: 'auto',
                maxHeight: '100px',
                objectFit: 'cover',
              }}
            />
          ) : (
            <span>Photo Gudang</span>
          )}
        </div>

        <div
          style={{
            flex: 1,
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: '0px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginBottom: '0px',
            }}
          >
            <span
              style={{
                textAlign: 'center',
                fontSize: '40px',
                fontWeight: 'bold',
                width: '100%',
                wordBreak: 'break-word',
                marginBottom: '0px',
              }}
            >
              {namaGudang || 'Nama Gudang'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: '0px',
            }}
          >
            <span
              style={{
                textAlign: 'center',
                fontSize: '16px',
                marginTop: '0px',
                fontStyle: 'italic',

                width: '100%',
                wordBreak: 'break-word',
              }}
            >
              <div>{alamatGudang || 'Alamat Gudang'}</div>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: '0px',
            }}
          >
            <span
              style={{
                textAlign: 'center',
                fontSize: '16px',
                width: '100%',
                wordBreak: 'break-word',
                fontStyle: 'italic',
              }}
            >
              <div>{telpolGudang || 'Telpon Gudang'}</div>
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div style={{ marginTop: '20px' }}>
          <div>
            Nomor: ____{takeInvoicesFromKledoBasedOnPelanggan[0]?.contact_id}
          </div>
          <div>Hal: Konfirmasi Hutang</div>
          <div>Lampiran: -</div>
        </div>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <div>Kepada Yth.</div>
          <div>
            <strong>{contactName}</strong>
          </div>
          <div>di-</div>
          <div>{contactAddress}</div>
        </div>
      </div>
      {/* Section Surat */}
      <div style={{ marginBottom: '20px' }}>
        Dengan Hormat,
        <br /> Melalui Surat ini, Kami Mengkonfirmasi Rincian Piutang Bapak/Ibu
        Sebagai Berikut:
      </div>
      {/* Table */}
      <Table
        dataSource={takeInvoicesFromKledoBasedOnPelanggan}
        columns={columns as any}
        rowKey="ref_number"
        pagination={false}
        style={{
          width: '100%',
          marginBottom: '30px',
        }}
        components={{
          body: {
            row: ({
              children,
              ...restProps
            }: React.HTMLAttributes<HTMLTableRowElement> & {
              children: React.ReactNode
            }) => (
              <tr
                {...restProps}
                style={{ lineHeight: '1.2', padding: '4px 8px' }}
              >
                {children}
              </tr>
            ),
            cell: ({
              children,
              ...restProps
            }: React.TdHTMLAttributes<HTMLTableDataCellElement> & {
              children: React.ReactNode
            }) => (
              <td {...restProps} style={{ padding: '4px 8px' }}>
                {children}
              </td>
            ),
          },
        }}
        summary={(pageData) => {
          let totalDue = 0
          pageData.forEach(({ due }) => {
            totalDue += Number(due)
          })
          let totalAmount = 0
          pageData.forEach(({ amount }) => {
            totalAmount += Number(amount)
          })

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} colSpan={1}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalAmount.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} colSpan={1}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${(
                    totalAmount - totalDue
                  ).toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={1}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalDue.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
      {/* Footer */}
      <div style={{ marginTop: '14px' }}>
        Demikian Laporan Evaluasi ini Kami Sampaikan, Terima Kasih Atas
        Kerjasama Anda
        <br />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span>
            . . . . . . . . . . . . . . . . . . . . . . , {formattedDate}
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '70px',
        }}
      >
        <div style={{ textAlign: 'center', flex: 1 }}>
          Mengetahui Kepala Cabang,
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>Menyetujui,</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>Manager</div>
        <div style={{ textAlign: 'center', flex: 1 }}>{contactName}</div>
      </div>
      <Button
        className="no-print" // Add this class
        onClick={handlePrint}
        style={{ color: '#AF8700', borderColor: '#AF8700' }}
      >
        Print Surat Jalan
      </Button>
    </div>
  )
})
export default DetailPiutangKontak

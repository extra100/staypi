import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Col, Table } from 'antd'

import { TakeInvoicesFromKledoBasedOnPelanggan } from '../TakeInvoicesFromKledoBasedOnPelanggan'
import { useGetContactsQuery } from '../../hooks/contactHooks'

import Warehouse from '../transaction/POS/warehouse'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import SingleDate from '../SingleDate'
import { formatDate, formatDateBulan } from './FormatDate'

const DetailPiutangKontak: React.FC = () => {
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
      title: 'Ref Number',
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
      title: 'Piutang',
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
    {
      title: 'Grand Total',
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
  ]

  const totalDue = filteredData.reduce((acc, item) => acc + item.due, 0)
  const today = new Date()
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const formattedDate = today.toLocaleDateString('id-ID', options)

  return (
    <div style={{ width: '800px' }}>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.6',
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {photoGudang && (
            <img
              src={photoGudang}
              alt="Gudang"
              style={{
                width: '60px',
                height: 'auto',
                marginRight: '60px',
                marginLeft: '150px',
              }}
            />
          )}

          <div
            style={{
              fontWeight: 'bold',
              fontSize: '1.5em',

              textAlign: 'right',
            }}
          >
            {namaGudang}
          </div>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            marginTop: '5px',
          }}
        >
          {alamatGudang}
          <br />
          Contact Person: {telpolGudang}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div>
            <div>
              Nomor : ____{takeInvoicesFromKledoBasedOnPelanggan[0]?.contact_id}
            </div>
            <div>Hal : Konfirmasi Hutang Jatuh Tempo</div>
            <div>Lampiran : -</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Kepada Yth.</div>
            <div>
              <strong>{contactName}</strong>
            </div>
            <div>di-</div>
            <div>{contactAddress}</div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          Dengan Hormat,
          <br /> Melalui Surat ini, Kami Mengkonfirmasi Rincian Piutang
          Bapak/ibu Sebagai Berikut:
        </div>

        <Table
          dataSource={takeInvoicesFromKledoBasedOnPelanggan}
          columns={columns as any}
          rowKey="ref_number"
          pagination={false}
          style={{ width: '100%' }} // Sesuaikan lebar tabel dengan parent
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
                <Table.Summary.Cell index={2} colSpan={1}>
                  <div style={{ textAlign: 'right' }}>
                    <strong>{`Rp ${totalDue.toLocaleString()}`}</strong>
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={1}>
                  <div style={{ textAlign: 'right' }}>
                    <strong>{`Rp ${totalAmount.toLocaleString()}`}</strong>
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />

        <div style={{ marginBottom: '50px', marginTop: '14px' }}>
          Demikian Laporan Evaluasi ini Kami Sampaikan, Terimakasih Atas
          Kerjasama Anda.
          <br />
          Salam Hormat Kami, {formattedDate}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>(an Branch Manager {namaGudang})</div>
        </div>
      </div>

      {/* Table Section */}
    </div>
  )
}

export default DetailPiutangKontak

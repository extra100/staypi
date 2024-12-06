import React, { forwardRef, useEffect, useState } from 'react'
import { Typography, Divider, Table, Row, Col } from 'antd'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import { useParams } from 'react-router-dom'
import {
  useGetGudangByIdQuery,
  useGetWarehousesQuery,
} from '../../hooks/warehouseHooks'
import {
  useGetContactsQuery,
  useGetPelangganByIdQuery,
} from '../../hooks/contactHooks'
import { useGetBarangByIdQuery } from '../../hooks/barangHooks'
import { formatDate } from './FormatDate'

const { Title, Text } = Typography

const Receipt = forwardRef<HTMLDivElement>((props, ref) => {
  const { ref_number } = useParams<{ ref_number?: string }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const [contactName, setContactName] = useState<string>('Unknown Contact')

  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )

  const witholdings = getPosDetail?.witholdings || []
  const barangName = getPosDetail?.items?.[0]?.name

  // const contactName = getPosDetail?.contacts?.[0]?.name
  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const qtyUpdated = getPosDetail?.items?.[0]?.qty_update

  const tglTransaksi = getPosDetail?.trans_date ?? 0
  const tglJatuhTempo = getPosDetail?.due_date ?? 0
  const refNumber = getPosDetail?.ref_number ?? 0
  const jumlahBayar = getPosDetail?.down_payment ?? 0
  const totalSemua = getPosDetail?.amount ?? 0
  const ketPelanggan = getPosDetail?.message ?? 0
  //
  const { data: gudang } = useGetWarehousesQuery()

  const getGudangDetail = gudang?.find(
    (gedung: any) => gedung.name === gudangName
  )

  const totalDownPayment = witholdings
    .filter((witholding: any) => witholding.status === 0)
    .reduce((total: number, witholding: any) => {
      return total + (witholding.down_payment || 0)
    }, 0)

  const sisaTagohan = totalSemua - totalDownPayment
  const namaGudang = getGudangDetail?.name ?? 0

  const codeGudang = getGudangDetail?.code ?? 0
  const photoGudang = getGudangDetail?.photo ?? 0
  const contactGudang = getGudangDetail?.contact ?? 0
  const namaTag = getPosDetail?.tages?.[1]?.name

  const { data: pelanggans } = useGetPelangganByIdQuery(name as unknown)
  const getPelangganDetil = pelanggans?.find(
    (gedung: any) => gedung.name === contactName
  )
  const alamatPelanggan = getPelangganDetil?.address ?? 0
  const telponPelanggan = getPelangganDetil?.phone ?? 0

  //
  const { data: barangs } = useGetBarangByIdQuery(name as unknown)
  const getDetailDetil = barangs?.find(
    (gedung: any) => gedung.name === barangName
  )

  const { data: contacts } = useGetContactsQuery()

  useEffect(() => {
    if (allTransactions && contacts) {
      const contactId = getPosDetail?.contacts?.[0]?.id
      const contact = contacts.find((c: any) => c.id === contactId)
      if (contact) {
        setContactName(contact.name)
      }
    }
  }, [allTransactions, contacts])
  const roundUpIndonesianNumber = (value: any): string => {
    let numberValue: number

    if (typeof value === 'string') {
      numberValue = parseFloat(value.replace(/\./g, '').replace(',', '.'))
    } else {
      numberValue = value
    }

    const rounded = Math.ceil(numberValue)

    return rounded.toLocaleString('id-ID')
  }
  const columns = [
    {
      title: 'No',
      key: 'qty_update',
      render: (text: any, record: any) => {
        const inv = allTransactions?.find(
          (transaction: any) => transaction.ref_number === ref_number
        )
        const item = inv?.items.find(
          (item: any) => item.finance_account_id === record.finance_account_id
        )
        return inv && item ? `Qt${item.qty_update}` : ''
      },
    },
    {
      title: 'Barang',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      align: 'center',
      render: (qty: number) => (
        <div style={{ textAlign: 'center' }}>
          {qty !== undefined ? qty : '0'}
        </div>
      ),
    },
    {
      title: 'Harga',
      key: 'amountPerBaris',
      align: 'left',
      render: (record: any) => {
        const amount = record.amount || 0
        const qty = record.qty || 1 // Pastikan qty tidak nol
        const amountPerBaris = qty > 0 ? amount / qty : 0
        return (
          <div style={{ textAlign: 'left' }}>
            {roundUpIndonesianNumber(amountPerBaris)}
          </div>
        )
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
  ]

  return (
    <div
      ref={ref} // Attach the ref here for printing
      style={{
        padding: 40,
        maxWidth: 700,
        background: '#fff',
        margin: 'auto',
        paddingTop: 10,
        paddingRight: 30,
      }}
    >
      <Row justify="center" align="middle">
        <Col span={6} style={{ textAlign: 'left' }}>
          {photoGudang && (
            <img
              src={photoGudang}
              alt="Gudang"
              style={{ width: '57%', height: '57%' }}
            />
          )}
        </Col>

        <Col span={18}>
          <Title level={4} style={{ textAlign: 'left' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {namaGudang}
          </Title>
          <Text style={{ display: 'block', textAlign: 'left' }}>
            {codeGudang} {contactGudang}
          </Text>
        </Col>
      </Row>

      {/* <Divider /> */}
      <br />
      <Row>
        <Col span={12}>
          <span>Pelanggan: {contactName}</span>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <span>{refNumber}</span>
        </Col>

        <Col span={12} style={{ textAlign: 'left' }}>
          <span>
            {alamatPelanggan &&
            alamatPelanggan !== 'Mohon Lengkapi Alamat' &&
            telponPelanggan &&
            telponPelanggan !== 'Mohon Lengkapi No Tlpn'
              ? `${alamatPelanggan} - ${telponPelanggan}`
              : ketPelanggan}
          </span>
        </Col>

        <Col span={12} style={{ textAlign: 'right' }}>
          <span>Tgl. Trans: {formatDate(tglTransaksi as any)}</span>
        </Col>
        <Col span={12} style={{ textAlign: 'left' }}>
          <span>Sales: {namaTag}</span>
        </Col>

        <Col span={12} style={{ textAlign: 'right' }}>
          <span>Tgl. Jatuh Tempo: {formatDate(tglJatuhTempo as any)}</span>
        </Col>
      </Row>

      <Table
        columns={columns as any}
        dataSource={getPosDetail?.items || []}
        pagination={false}
        style={{ marginTop: 20, marginBottom: 20 }}
        components={{
          header: {
            cell: ({
              children,
              ...restProps
            }: React.ThHTMLAttributes<HTMLTableHeaderCellElement> & {
              children: React.ReactNode
            }) => (
              <th
                {...restProps}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  borderBottom: '1px dashed #000',
                }}
              >
                {children}
              </th>
            ),
          },
          body: {
            row: ({
              children,
              ...restProps
            }: React.HTMLAttributes<HTMLTableRowElement> & {
              children: React.ReactNode
            }) => (
              <tr
                {...restProps}
                style={{
                  lineHeight: '1.2',
                  padding: '4px 8px',
                  borderBottom: '1px dashed #000', // Garis putus-putus hitam pekat
                }}
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
              <td
                {...restProps}
                style={{
                  padding: '4px 8px',
                  borderBottom: '1px dashed #000', // Garis putus-putus hitam pekat
                }}
              >
                {children}
              </td>
            ),
          },
        }}
      />

      <Row style={{ marginRight: '20px' }}>
        <Col span={12}>
          <Text>Tanda Terima:</Text>
          <br />
          <Text></Text>
          <br />
          <Text>{contactName}</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text strong style={{ minWidth: '120px', textAlign: 'left' }}>
              Total Tagihan:
            </Text>
            <Text strong style={{ minWidth: '120px', textAlign: 'right' }}>
              {roundUpIndonesianNumber(totalSemua)}
            </Text>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text strong style={{ minWidth: '120px', textAlign: 'left' }}>
              Jml Bayar:
            </Text>
            <Text strong style={{ minWidth: '120px', textAlign: 'right' }}>
              {witholdings
                .filter(
                  (witholding: any) =>
                    witholding.status === 0 && witholding.down_payment !== 0
                ) // Tambahkan pengecekan down_payment !== 0
                .map((witholding: any, index) => (
                  <Row key={index}>
                    <Col span={12} style={{ textAlign: 'left' }}></Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong>
                        {roundUpIndonesianNumber(witholding.down_payment || 0)}
                      </Text>
                    </Col>
                  </Row>
                ))}
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text strong style={{ minWidth: '120px', textAlign: 'left' }}>
              Total Bayar:
            </Text>
            <Text strong style={{ minWidth: '120px', textAlign: 'right' }}>
              {roundUpIndonesianNumber(totalDownPayment || 0)}
            </Text>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text strong style={{ minWidth: '120px', textAlign: 'left' }}>
              Sisa Tagihan:
            </Text>
            <Text strong style={{ minWidth: '120px', textAlign: 'right' }}>
              {roundUpIndonesianNumber(sisaTagohan < 0 ? 0 : sisaTagohan)}
            </Text>
          </div>
        </Col>
      </Row>

      <Divider />

      <Row justify="center">
        <Col span={24}>
          <Text style={{ display: 'block', textAlign: 'center' }}>
            Terima Kasih
          </Text>
          <Text style={{ display: 'block', textAlign: 'center' }}>
            Barang yang sudah dibeli tidak dapat dikembalikan
          </Text>
        </Col>
      </Row>
    </div>
  )
})

export default Receipt

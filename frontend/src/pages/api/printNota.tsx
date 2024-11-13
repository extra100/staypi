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
  const refNumber = getPosDetail?.ref_number ?? 0
  const jumlahBayar = getPosDetail?.down_payment ?? 0
  const totalSemua = getPosDetail?.amount ?? 0
  const piutang = getPosDetail?.due ?? 0
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
  console.log({ totalDownPayment })
  const sisaTagohan = totalSemua - totalDownPayment
  const namaGudang = getGudangDetail?.name ?? 0
  console.log({ namaGudang })
  const codeGudang = getGudangDetail?.code ?? 0
  const photoGudang = getGudangDetail?.photo ?? 0
  const contactGudang = getGudangDetail?.contact ?? 0
  console.log({ contactGudang })

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
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
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
        return inv && item ? `inv-${item.qty_update}` : 'inv -'
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
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <div style={{ textAlign: 'right' }}>
          {price !== undefined ? `${price.toLocaleString()}` : 'Rp 0'}
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <div style={{ textAlign: 'right' }}>
          {amount !== undefined ? `${amount.toLocaleString()}` : 'Rp 0'}
        </div>
      ),
    },
  ]

  return (
    <div
      ref={ref} // Attach the ref here for printing
      style={{
        padding: 30,
        maxWidth: 600,
        background: '#fff',
        margin: 'auto',
        paddingTop: 10,
        paddingRight: 40,
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
            {alamatPelanggan} - {telponPelanggan}
          </span>
        </Col>

        <Col span={12} style={{ textAlign: 'right' }}>
          <span>{tglTransaksi}</span>
        </Col>
      </Row>

      <Table
        columns={columns as any}
        dataSource={getPosDetail?.items || []}
        pagination={false}
        bordered
        style={{ marginTop: 20 }}
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
      />

      <Divider />

      <Row>
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
              {totalSemua?.toLocaleString('id-ID')}
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
                .filter((witholding: any) => witholding.status === 0)
                .map((witholding: any, index) => (
                  <Row key={index}>
                    <Col span={12} style={{ textAlign: 'left' }}></Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong>
                        {formatNumber(witholding.down_payment)}
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
              {totalDownPayment?.toLocaleString('id-ID')}
            </Text>
            {/* <Text strong style={{ minWidth: '120px', textAlign: 'left' }}>
              {witholdings.map((witholding: any, index: number) => (
                <Row key={index}>
                  <Col span={12} style={{ textAlign: 'left' }}></Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Text strong>{formatNumber(totalDownPayment)}</Text>
                  </Col>
                </Row>
              ))}
            </Text> */}
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
              {sisaTagohan?.toLocaleString('id-ID')}
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

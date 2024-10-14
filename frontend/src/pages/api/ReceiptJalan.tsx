import React, { forwardRef } from 'react'
import { Typography, Divider, Table, Row, Col } from 'antd'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import { useParams } from 'react-router-dom'
import { useGetGudangByIdQuery } from '../../hooks/warehouseHooks'
import { useGetPelangganByIdQuery } from '../../hooks/contactHooks'
import { useGetBarangByIdQuery } from '../../hooks/barangHooks'

const { Title, Text } = Typography

const ReceiptJalan = forwardRef<HTMLDivElement>((props, ref) => {
  const { ref_number } = useParams<{ ref_number?: string }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )

  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const barangName = getPosDetail?.items?.[0]?.name

  const contactName = getPosDetail?.contacts?.[0]?.name
  const gudangName = getPosDetail?.warehouses?.[0]?.name

  const tglTransaksi = getPosDetail?.trans_date ?? 0
  const refNumber = getPosDetail?.ref_number ?? 0
  const jumlahBayar = getPosDetail?.down_payment ?? 0
  const totalSemua = getPosDetail?.amount ?? 0
  const piutang = getPosDetail?.due ?? 0
  //
  const { data: gudang } = useGetGudangByIdQuery(name as unknown)
  const getGudangDetail = gudang?.find(
    (gedung: any) => gedung.name === gudangName
  )
  const namaGudang = getGudangDetail?.name ?? 0
  const codeGudang = getGudangDetail?.code ?? 0
  const photoGudang = getGudangDetail?.photo ?? 0
  const contactGudang = getGudangDetail?.contact ?? 0

  const { data: pelanggans } = useGetPelangganByIdQuery(name as unknown)
  const getPelangganDetil = pelanggans?.find(
    (gedung: any) => gedung.name === contactName
  )
  const alamatPelanggan = getPelangganDetil?.address ?? 0
  const telponPelanggan = getPelangganDetil?.phone ?? 0
  console.log({ alamatPelanggan })

  //
  const { data: barangs } = useGetBarangByIdQuery(name as unknown)
  const getDetailDetil = barangs?.find(
    (gedung: any) => gedung.name === barangName
  )
  console.log({ getDetailDetil })
  const columns = [
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
      title: 'Barang',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sat',
      key: 'unit_id',
      dataIndex: 'unit_id',
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
      }}
    >
      <Row justify="center" align="middle">
        <Col span={6} style={{ textAlign: 'left' }}>
          {photoGudang && (
            <img
              src={photoGudang}
              alt="Gudang"
              style={{ width: '50%', height: 'auto' }}
            />
          )}
        </Col>

        <Col span={18}>
          <Title level={4} style={{ textAlign: 'left' }}>
            SURAT JALAN {namaGudang}
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
          <span>Kepada Yth: {contactName}</span>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <span>{refNumber}</span>
        </Col>

        <Col span={12} style={{ textAlign: 'left' }}>
          <span>
            di_ : {alamatPelanggan} - {telponPelanggan}
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
      </Row>

      <Divider />

      <Row justify="center">
        <Col span={24}>
          <Text style={{ display: 'block', textAlign: 'center' }}>
            Terima Kasih
          </Text>
          <Text style={{ display: 'block', textAlign: 'center' }}>
            Mohon Untuk Di Periksa Terlebih Dahulu
          </Text>
        </Col>
      </Row>
    </div>
  )
})
export default ReceiptJalan

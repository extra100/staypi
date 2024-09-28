import React, { forwardRef } from 'react'
import { Typography, Divider, Table, Row, Col } from 'antd'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import { useParams } from 'react-router-dom'

const { Title, Text } = Typography

// Forward ref so that the parent component can refer to this component for printing
const Receipt = forwardRef<HTMLDivElement>((props, ref) => {
  const { ref_number } = useParams<{ ref_number?: string }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const contactName = getPosDetail?.contacts?.[0]?.name
  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const tglTransaksi = getPosDetail?.trans_date ?? 0
  const jumlahBayar = getPosDetail?.down_payment ?? 0
  const totalSemua = getPosDetail?.amount ?? 0
  const piutang = getPosDetail?.due ?? 0

  const columns = [
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Barang',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Satuan',
      key: 'unit_id',
      dataIndex: 'unit_id',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) =>
        price !== undefined ? `Rp ${price.toLocaleString()}` : 'Rp 0',
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) =>
        amount !== undefined ? `Rp ${amount.toLocaleString()}` : 'Rp 0',
    },
  ]

  return (
    <div
      ref={ref} // Attach the ref here for printing
      style={{ padding: 20, maxWidth: 600, background: '#fff', margin: 'auto' }}
    >
      <Row justify="center">
        <Col span={24}>
          <Title level={4} style={{ textAlign: 'center' }}>
            {gudangName}
          </Title>
          <Text style={{ display: 'block', textAlign: 'center' }}>
            Jl. KH. sgrjog kddmihe No. 343554
          </Text>
          <Text style={{ display: 'block', textAlign: 'center' }}>
            087859117485 (WA) / 087859117485 (TLP)
          </Text>
        </Col>
      </Row>

      <Divider />

      <Row>
        <Col span={12}>
          <span>Tujuan: {contactName}</span>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <span>{tglTransaksi}</span>
        </Col>

        <Col>
          <span>Alamat: Kopang mtng gamang. CP. 08783246463</span>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={getPosDetail?.items || []}
        pagination={false}
        bordered
        // summary={() => (
        //   <Table.Summary.Row>
        //     <Table.Summary.Cell colSpan={3} align="right">
        //       <Text>Total</Text>
        //     </Table.Summary.Cell>
        //     <Table.Summary.Cell align="right">
        //       <Text strong>{totalSemua}</Text>
        //     </Table.Summary.Cell>
        //   </Table.Summary.Row>
        // )}
        style={{ marginTop: 20 }}
      />

      <Divider />

      <Row>
        <Col span={12}>
          <Text>Tanda Terima:</Text>
          <br />
          <Text></Text>
          <br />
          <Text>.............</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Text strong>Total: {totalSemua}</Text>
          <br />
          <Text strong>Cash: {jumlahBayar}</Text>
          <br />
          <Text strong>Sisa: {piutang}</Text>
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

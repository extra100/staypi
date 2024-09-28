import React, { forwardRef } from 'react'
import { Typography, Divider, Table, Row, Col } from 'antd'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import { useParams } from 'react-router-dom'

const { Title, Text } = Typography

const ReceiptJalan = forwardRef<HTMLDivElement>((props, ref) => {
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
  const NoInv = getPosDetail?.ref_number ?? 0

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
  ]

  return (
    <div ref={ref} style={{ padding: 20, maxWidth: 600, background: '#fff' }}>
      <Row justify="center">
        <Col span={24}>
          <Title level={3} style={{ textAlign: 'center' }}>
            SURAT JALAN {NoInv}
          </Title>
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
          <span>Pelanggan: {contactName}</span>
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
          <Text>Driver:</Text>
          <br />
          <Text>.............</Text>
        </Col>
        <Col>
          <Text>Pembeli:</Text>
          <br />
          <Text>.............</Text>
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

export default ReceiptJalan

import React, { useRef, useState } from 'react'
import {
  Table,
  Typography,
  Row,
  Col,
  Menu,
  Tag,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Card,
  Dropdown,
  Space,
  Divider,
  message,
} from 'antd'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import { Link, useParams } from 'react-router-dom'
import { AiOutlinePrinter } from 'react-icons/ai'
import PosPrintKomponent from './PosPrintCok'
import moment from 'moment'
import dayjs from 'dayjs'
import { useFiac } from './Fiac'
import { saveToApiNextPayment } from './NextPayment'
import { useReactToPrint } from 'react-to-print'
import Receipt from './printNota'
import ReceiptJalan from './ReceiptJalan'

const { Title, Text } = Typography
const { Option } = Select

const DetailKledo: React.FC = () => {
  const { ref_number } = useParams<{ ref_number?: string }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )

  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const contactName = getPosDetail?.contacts?.[0]?.name
  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const tagName = getPosDetail?.tages?.[0]?.name
  const due = getPosDetail?.due ?? 0
  const amount = getPosDetail?.amount ?? 0
  const witholdings = getPosDetail?.witholdings || []
  const items = getPosDetail?.items || []

  const totalDiscount = items.reduce((total: number, item: any) => {
    return total + (item.discount_amount || 0)
  }, 0)
  const subTotal = totalDiscount + amount

  const { fiAc } = useFiac()

  const [amountPaid, setAmountPaid] = useState<number | null>(null)
  console.log({ amountPaid })
  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (!isNaN(value) && value <= due) {
      setAmountPaid(value)
    } else {
      alert('Jumlah bayar tidak boleh melebihi total tagihan')
    }
  }
  const [selectedBank, setSelectedBank] = useState<any | null>(null)

  const today = dayjs().format('DD-MM-YYYY')
  const { saveNextPayment } = saveToApiNextPayment()
  const handleFormSubmit = (values: any) => {
    const accountMap = fiAc?.children?.reduce((map: any, warehouse: any) => {
      map[warehouse.name] = warehouse.id
      return map
    }, {})
    const accountId = accountMap[selectedBank as any]
    const payload = {
      amount: values.jumlahBayar,
      attachment: [],
      bank_account_id: accountId,
      business_tran_id: null,
      memo: values.catatan || null,
      trans_date: values.tanggalBayar.format('YYYY-MM-DD'),
      witholdings: [],
    }
  }
  const printNota = useRef<HTMLDivElement>(null)

  const printNotaHandler = useReactToPrint({
    content: () => printNota.current,
  })

  const printSuratJalan = useRef<HTMLDivElement>(null)

  const printSuratJalanHandler = useReactToPrint({
    content: () => printSuratJalan.current,
  })

  const columns = [
    {
      title: 'Barang',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
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
    <div style={{ padding: '20px' }}>
      <Card
        title={
          <Row align="middle" justify="space-between">
            <Col>
              {getPosDetail?.status_id === 1 && (
                <Tag color="red">Belum Dibayar</Tag>
              )}
              {getPosDetail?.status_id === 2 && (
                <Tag color="orange">Dibayar Sebagian</Tag>
              )}
              {getPosDetail?.status_id === 3 && <Tag color="green">Lunas</Tag>}
              {getPosDetail?.status_id === undefined && (
                <Title level={5}>Detail Tagihan</Title>
              )}
            </Col>
            <Col>
              {/* <a href={`/printnota/${ref_number}`}>PRINT</a> */}
              <div>
                <button onClick={printNotaHandler}>Print Nota</button>
                <div style={{ display: 'none' }}>
                  {' '}
                  <Receipt ref={printNota} />
                </div>
              </div>
              <div>
                <button onClick={printSuratJalanHandler}>
                  Print Surat Jalan
                </button>
                <div style={{ display: 'none' }}>
                  {' '}
                  <ReceiptJalan ref={printSuratJalan} />
                </div>
              </div>
            </Col>
          </Row>
        }
        bordered
      >
        {/* Transaction Details */}
        <Row>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Pelanggan:</Text>
            </div>
            <Title level={5} style={{ marginBottom: 0 }}>
              {contactName}
            </Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>NOMOR:</Text>
            </div>
            <Title level={5}>{getPosDetail?.ref_number || []}</Title>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tgl. Transaksi:</Text>
            </div>
            <Title level={5}>{getPosDetail?.trans_date || []}</Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tgl. Jatuh Tempo:</Text>
            </div>
            <Title level={5}>{getPosDetail?.due_date || []}</Title>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Gudang:</Text>
            </div>
            <Title level={5}>{gudangName}</Title>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '0px' }}>
              <Text strong>Tag:</Text>
            </div>
            <Title level={5}>{tagName}</Title>
          </Col>
        </Row>
      </Card>

      {/* Transaction Table */}
      <Table
        dataSource={getPosDetail?.items || []}
        columns={columns}
        pagination={false}
        rowKey="_id"
        style={{ marginTop: '20px' }}
      />

      <div
        style={{
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Row gutter={16}>
          <Col span={12}></Col>
          <Col span={12}>
            <Row>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Sub Total</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{subTotal}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total Diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{totalDiscount}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total setelah diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{amount}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>Total</Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>{amount}</Title>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <>
              {witholdings.map((witholding: any, index: number) => (
                <Row key={index} style={{ marginTop: '8px' }}>
                  <Col span={12} style={{ textAlign: 'left' }}>
                    <Text strong>{witholding.name}</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Text strong>{witholding.witholding_amount}</Text>
                  </Col>
                </Row>
              ))}
            </>

            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '20px' }}>
                  {' '}
                  Sisa Tagihan
                </Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong style={{ fontSize: '20px' }}>
                  {' '}
                  {due}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Card title="Pembayaran" style={{ marginTop: '20px' }}>
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="jumlahBayar"
                label="Jumlah Bayar"
                rules={[
                  { required: true, message: 'Masukkan jumlah pembayaran' },
                ]}
              >
                <Input
                  type="number"
                  value={amountPaid as any}
                  onChange={handleAmountPaidChange}
                  max={due}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tanggalBayar"
                label="Tanggal Pembayaran"
                rules={[
                  { required: true, message: 'Pilih tanggal pembayaran' },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  defaultValue={dayjs()}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Select
                placeholder="Pilih bank"
                value={selectedBank as number}
                onChange={(value) => setSelectedBank(value)}
                style={{ marginTop: '16px', width: '100%' }}
              >
                {fiAc?.children?.map((e) => (
                  <Select.Option key={e.id} value={e.name}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Form.Item name="catatan">
                <Input.TextArea rows={2} placeholder="Catatan" />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit">
                Simpan Pembayaran
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default DetailKledo

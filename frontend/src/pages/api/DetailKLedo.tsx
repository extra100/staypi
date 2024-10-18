import React, { useEffect, useRef, useState } from 'react'
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
  Spin,
} from 'antd'
import {
  useAddTransactionMutation,
  useGetTransactionByIdQuery,
  useUpdateTransactionMutation,
} from '../../hooks/transactionHooks'
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
import { useIdInvoice } from './takeSingleInvoice'
import { useIdWarehouse } from './namaWarehouse'
import { useGetContactsQuery } from '../../hooks/contactHooks'
import { useGetAkunBanksQueryDb } from '../../hooks/akunBankHooks'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { NumericFormat } from 'react-number-format'

import type { Dayjs } from 'dayjs'
const { Title, Text } = Typography
const { Option } = Select

const DetailKledo: React.FC = () => {
  const [showButtons, setShowButtons] = useState(false)
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(currentDate)
  console.log({ startDate })
  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date)
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])
  const { ref_number } = useParams<{ ref_number?: string }>()
  const updatePosMutation = useUpdateTransactionMutation()
  //
  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const { data: contacts } = useGetContactsQuery()
  const { data: akunBanks } = useGetAkunBanksQueryDb()

  const { getIdAtInvoice } = useIdInvoice(ref_number || '')

  const invoiceId = getIdAtInvoice ? getIdAtInvoice.id : null
  const refNumber = getIdAtInvoice ? getIdAtInvoice.ref_number : null

  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  // const contactName = getPosDetail?.contacts?.[0]?.name
  const gudangName = getPosDetail?.warehouses?.[0]?.name
  const gudangId = getPosDetail?.warehouses?.[0]?.warehouse_id

  const tagName = getPosDetail?.tages?.[0]?.name

  const amount = getPosDetail?.amount ?? 0
  const witholdings = getPosDetail?.witholdings || []
  const items = getPosDetail?.items || []
  const totalDownPayment = witholdings.reduce(
    (sum: number, witholding: any) => {
      return sum + (witholding.down_payment || 0)
    },
    0
  )

  const due = amount - totalDownPayment
  const totalDiscount = items.reduce((total: number, item: any) => {
    return total + (item.discount_amount || 0)
  }, 0)
  const subTotal = totalDiscount + amount

  const { fiAc } = useFiac()

  const [amountPaid, setAmountPaid] = useState<number | null>(null)
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (!isNaN(value) && value <= due) {
      setAmountPaid(value)
    } else {
      alert('Jumlah bayar tidak boleh melebihi total tagihan')
    }
  }
  const handleSetAmountPaid = () => {
    setAmountPaid(due)
  }
  const [contactName, setContactName] = useState<string>('Unknown Contact')

  useEffect(() => {
    if (allTransactions && contacts) {
      const contactId = getPosDetail?.contacts?.[0]?.id
      const contact = contacts.find((c: any) => c.id === contactId)
      if (contact) {
        setContactName(contact.name)
      }
    }
  }, [allTransactions, contacts])
  const { idWarehouse } = useIdWarehouse()

  const [selectedBank, setSelectedBank] = useState<any | null>(null)
  console.log({ selectedBank })

  const today = dayjs().format('DD-MM-YYYY')
  const { saveNextPayment } = saveToApiNextPayment()
  const handleFormSubmit = (values: any) => {
    const accountMap = fiAc?.children?.reduce((map: any, warehouse: any) => {
      map[warehouse.name] = warehouse.id
      return map
    }, {})

    const accountId = accountMap[selectedBank as any]

    if (refNumber) {
      const invoiceData = {
        withholdings: [
          {
            witholding_account_id: accountId || bankAccountId,
            name: selectedBank || bankAccountName,
            down_payment: amountPaid || 0,
            witholding_percent: 0,
            witholding_amount: amountPaid || 0,
          },
        ],
      }

      const existingInvoice = allTransactions?.find(
        (transaction) => transaction.ref_number === refNumber
      )

      if (existingInvoice) {
        const updatedWithholdings = [
          ...existingInvoice.witholdings,
          ...invoiceData.withholdings,
        ]

        const updatedInvoice = {
          ...existingInvoice,
          witholdings: updatedWithholdings,
        }

        updatePosMutation.mutate(updatedInvoice)
      } else {
        console.error('Invoice with ref_number not found:', refNumber)
      }
    } else {
      console.error('No valid ref_number found.')
    }

    const payload = {
      amount: amountPaid,
      attachment: [],
      bank_account_id: accountId || bankAccountId,
      business_tran_id: invoiceId,
      witholding_amount: amountPaid,
      memo: values.catatan || null,
      trans_date: values.tanggalBayar.format('YYYY-MM-DD'),
      witholdings: [],
    }

    console.log('Payload:', payload)

    saveNextPayment(payload)
      .then((response: any) => {
        console.log('Payment saved successfully:', response)
      })
      .catch((error: any) => {
        console.error('Error saving payment:', error)
      })
  }
  const printNota = useRef<HTMLDivElement>(null)

  const printNotaHandler = useReactToPrint({
    content: () => printNota.current,
  })

  const printSuratJalan = useRef<HTMLDivElement>(null)

  const printSuratJalanHandler = useReactToPrint({
    content: () => printSuratJalan.current,
  })

  const akunBank = useGetAkunBanksQueryDb()

  const tele = akunBank?.data

  const matchingTele = tele?.find((item) => {
    const nameParts = item.name.split('_')
    return nameParts[1] === gudangName
  })

  const [bankAccountName, setBankAccountName] = useState<string | null>(null)
  console.log({ bankAccountName })
  const [bankAccountId, setBankAccountId] = useState<string | null>(null)

  const [warehouseName, setWarehouseName] = useState<string | null>(null)
  const { data: gudangdb } = useGetWarehousesQuery()

  const getWarehouseName = () => {
    if (!gudangdb || !gudangId) return null

    const selectedWarehouse = gudangdb.find(
      (warehouse: { id: number; name: string }) =>
        warehouse.id === Number(gudangId)
    )
    return selectedWarehouse ? selectedWarehouse.name : null
  }

  useEffect(() => {
    const name = getWarehouseName()
    setWarehouseName(name)
    if (name) {
    }
  }, [gudangdb, gudangId])
  const getBankAccountName = () => {
    if (!akunBanks || !warehouseName) return null

    const matchingBankAccount = akunBanks.find((bank: { name: string }) => {
      const parts = bank.name.split('_')
      return parts[1] === warehouseName
    })
    return matchingBankAccount ? matchingBankAccount.name : null
  }
  useEffect(() => {
    const name = getBankAccountName()
    setBankAccountName(name)
  }, [warehouseName, akunBanks])
  const getBankAccountId = () => {
    if (!akunBanks || !warehouseName) return null

    const matchingBankAccount = akunBanks.find(
      (bank: { name: any; id: any }) => {
        const parts = bank.name.split('_')
        return parts[1] === warehouseName
      }
    )
    return matchingBankAccount ? matchingBankAccount.id : null
  }
  const matchingName = matchingTele?.name
  useEffect(() => {
    if (bankAccountName) {
      setSelectedBank(bankAccountName)
    }
  }, [bankAccountName])
  useEffect(() => {
    const id = getBankAccountId()
    setBankAccountId(id as any)
  }, [warehouseName, akunBanks])
  const columns = [
    {
      title: 'Nosfsfs',
      key: 'no',
      align: 'center',
      render: (_: any, __: any, index: number) => (
        <div style={{ textAlign: 'center' }}>{index + 1}</div>
      ),
    },
    {
      title: 'Barang',
      dataIndex: 'name',
      key: 'name',
      align: 'center', // Header tetap rata tengah
      render: (name: string) => (
        <div style={{ textAlign: 'left' }}>
          {name !== undefined ? name : ''}
        </div>
      ), // Konten rata kiri
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
      title: 'Satuan',
      key: 'unit_id',
      dataIndex: 'unit_id',
      align: 'center',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
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
      align: 'center',
      render: (amount: number) => (
        <div style={{ textAlign: 'right' }}>
          {amount !== undefined ? `${amount.toLocaleString()}` : 'Rp 0'}
        </div>
      ),
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
              {showButtons && ( // Conditionally render the buttons after 2 seconds
                <>
                  <div>
                    <button onClick={printNotaHandler}>Print Nota</button>
                    <div style={{ display: 'none' }}>
                      <Receipt ref={printNota} />
                    </div>
                  </div>

                  <div>
                    <button onClick={printSuratJalanHandler}>
                      Print Surat Jalan
                    </button>
                    <div style={{ display: 'none' }}>
                      <ReceiptJalan ref={printSuratJalan} />
                    </div>
                  </div>
                </>
              )}
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
        columns={columns as any}
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
                <Text strong>{formatNumber(subTotal)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total Diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{formatNumber(totalDiscount)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>Total setelah diskon</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text strong>{formatNumber(amount)}</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>Total</Title>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Title level={4}>{formatNumber(amount)}</Title>
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
                    <Text strong>{formatNumber(witholding.down_payment)}</Text>
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
                  {formatNumber(due)}
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
              <span
                style={{
                  // ...labelStyle,
                  fontSize: '16px',

                  cursor: 'pointer',
                }}
                onClick={handleSetAmountPaid}
              >
                Jumlah Bayar
              </span>
              <span
                style={{
                  // ...labelColonStyle,
                  fontSize: '16px',
                }}
              >
                :
              </span>

              <NumericFormat
                placeholder="Nilai Pembayaran"
                value={amountPaid as any}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                allowNegative={false}
                onValueChange={(values) => {
                  const { floatValue } = values
                  setAmountPaid(floatValue || 0)
                }}
                customInput={Input}
                max={due}
                style={{
                  width: '100%',
                  textAlign: 'right',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#007BFF',
                }}
              />
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
                  value={startDate}
                  onChange={handleStartDateChange}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Select
                showSearch // Menampilkan kolom pencarian
                placeholder="Pilih bank"
                value={selectedBank}
                onChange={(value) => setSelectedBank(value)}
                style={{ width: '100%' }}
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option?.children
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {akunBanks?.map((e) => (
                  <Select.Option key={e.id} value={e.name}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Form.Item name="catatan">
                <Input placeholder="Catatan" />
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

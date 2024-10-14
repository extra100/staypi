import React, { useState, useEffect } from 'react'
//
import {
  Select,
  Badge,
  Table,
  Button,
  Form,
  Collapse,
  Row,
  Col,
  Typography,
} from 'antd'
import { useStokBarang } from './StokBarang'
import { useIdWarehouse } from './namaWarehouse'
import { useIdNamaBarang } from './NamaBarang'
import Input from 'antd/es/input/Input'
import DateRange from '../DateRange'
import TextArea from 'antd/es/input/TextArea'

import { useIdNamaTag } from './NamaTag'
import { useIdContact } from './NamaContact'
import { useFiac } from './Fiac'
import { SaveApi } from './SaveApi'
import { v4 as uuidv4 } from 'uuid'
import { useAddTransactionMutation } from '../../hooks/transactionHooks'
import { Navigate } from 'react-router-dom'
import { useGetBarangsQuery } from '../../hooks/barangHooks'

const { Option } = Select
const { Title, Text } = Typography

const StockSelectorTable = () => {
  const { Panel } = Collapse

  const { dataStokBarang, fetchStokBarang } = useStokBarang()

  const { idaDataBarang } = useIdNamaBarang()
  const { data: barangs } = useGetBarangsQuery()

  const { idWarehouse } = useIdWarehouse()

  // const { idContact } = useIdContact()
  const { idContact } = useIdContact()
  console.log({ idContact })
  const { saveInvoiceData } = SaveApi()
  const addPosMutation = useAddTransactionMutation()

  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: number
  }>({})
  const [selectedFinanceAccountIds, setSelectedFinanceAccountIds] = useState<
    string[]
  >([])

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )

  // const [dataSource, setDataSource] = useState<
  //   { id: string; name: string; qty: number }[]
  // >([])
  const [dataSource, setDataSource] = useState<any[]>([])

  useEffect(() => {
    if (selectedFinanceAccountIds.length > 0 && selectedWarehouseId !== null) {
      selectedFinanceAccountIds.forEach((productId: any) => {
        fetchStokBarang(productId, Number(selectedWarehouseId))
      })
    }
  }, [selectedFinanceAccountIds, selectedWarehouseId])

  useEffect(() => {
    if (dataStokBarang) {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [dataStokBarang.productId]: dataStokBarang.qty,
      }))
    }
  }, [dataStokBarang])
  const customDisplayRender = (value: any) => {
    return ''
  }
  const handleProductChange = (values: string[]) => {
    setSelectedFinanceAccountIds(values)
  }
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: any) => {
    setSearchValue(value)
  }

  const [dropdownVisible, setDropdownVisible] = useState(false)

  const discountRates = [
    { label: 'Retail 10%', percentage: 10 },
    { label: 'Applikator 16%', percentage: 16 },
    { label: 'Toko 18%', percentage: 18 },
    { label: 'Nego 19%', percentage: 19 },
    { label: 'Khusus 21%', percentage: 21 },
  ]
  const calculateDiscount = (price: number, percentage: number): number => {
    const discountAmount = (price * percentage) / 100
    const discountedPrice = price - discountAmount

    return discountedPrice
  }
  const calculateSubtotal = (price: number, qty: number) => {
    return price * qty
  }
  const handleDiscountChange = (value: string, record: any) => {
    const selectedDiscount = discountRates.find((rate) => rate.label === value)
    if (selectedDiscount) {
      const newPrice = calculateDiscount(
        record.price,
        selectedDiscount.percentage
      )
      setDataSource((prev) =>
        prev.map((item: any) =>
          item.finance_account_id === record.finance_account_id
            ? {
                ...item,
                price: newPrice,
                selectedDiscount: value,
                subtotal: calculateSubtotal(newPrice, item.qty),
              }
            : item
        )
      )
    }
  }
  const warehouseMap = idWarehouse.reduce((map: any, warehouse: any) => {
    map[warehouse.id] = warehouse.name
    return map
  }, {})
  const warehouseId = warehouseMap[selectedWarehouseId as any]
  const untukTag = idWarehouse.reduce((map: any, warehouse: any) => {
    map[warehouse.id] = warehouse.name
    return map
  }, {})
  const forTag = untukTag[selectedWarehouseId as any]

  const handleWarehouseChange = (value: number | string) => {
    setSelectedWarehouseId(value)
    const matchingTag = idDataTag.find((tag) => tag.name === forTag)
    setSelectedContact(null)

    setSelectag(matchingTag ? matchingTag.id : null)
    const bangke = idWarehouse.reduce((map: any, warehouse: any) => {
      map[warehouse.id] = warehouse.name
      return map
    }, {})
    const namaBangke = bangke[value as any]

    const findMatchingBank = (namaGudang: string) => {
      return fiAc?.children?.find((bank) =>
        bank.name.startsWith(`KAS PENJUALAN_${namaGudang}`)
      )
    }

    const matchingBank = findMatchingBank(namaBangke)

    if (matchingBank) {
      setSelectedBank(matchingBank.name)
    }
  }

  const handleOkClick = () => {
    setDropdownVisible(false)
    const selectedItems = idaDataBarang.filter((item: any) =>
      selectedFinanceAccountIds.includes(item.id)
    )
    setDataSource((prev) => [
      ...prev,
      ...selectedItems
        .filter(
          (item) =>
            !prev.some(
              (existingItem) => existingItem.finance_account_id === item.id
            )
        )
        .map((item) => ({
          finance_account_id: item.id,
          finance_account_name: item.name,
          price: item.price,
          // unit_id: 5,
          qty: 1,
          selectedDiscount: 'Retail 10%',
          subtotal: item.price,
          unit: item.unit?.id,
        })),
    ])
    setSelectedFinanceAccountIds(selectedFinanceAccountIds.map(String))
  }

  const handleQtyChange = (value: number, record: any) => {
    setDataSource((prev) =>
      prev.map((item) =>
        item.finance_account_id === record.finance_account_id
          ? {
              ...item,
              qty: value,
              subtotal: calculateSubtotal(item.price, value),
            }
          : item
      )
    )
  }

  const handleDelete = (key: any) => {
    setDataSource((prev) =>
      prev.filter((pos) => pos.finance_account_id !== key)
    )
    setAmountPaid(null)
  }
  const [selectedDates, setSelectedDates] = useState<[string, string]>(['', ''])

  const [selectedDifference, setSelectedDifference] = useState<number>(0)
  const handleDateRangeSave = (
    startDate: string,
    endDate: string,
    difference: number
  ) => {
    setSelectedDates([startDate, endDate])
    setSelectedDifference(difference)
  }

  const { idDataTag } = useIdNamaTag()
  const [selectTag, setSelectag] = useState<any | null>([null])

  const [paymentForm] = Form.useForm()
  const handleTag = (value: number) => {
    setSelectag(value)
  }

  const [selectedContact, setSelectedContact] = useState<number | null>(null)

  const handleContactChange = (value: number) => {
    setSelectedContact(value)
  }
  const selectedReceivable = selectedContact
    ? idContact.find((contact: any) => contact.id === selectedContact)
        ?.receivable
    : '--'

  const formatRupiah = (number: any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number)
  }
  const totalReceivable = idContact
    ?.filter((contact: any) => contact.group_name === warehouseId)
    .reduce((total: number, contact: any) => {
      const receivable = parseFloat(contact.receivable) || 0
      return total + receivable
    }, 0)
  const limitizeTrans = totalReceivable > 3800
  const [totalSubtotal, setTotalSubtotal] = useState<number>(0)

  const [formattedTotalSubtotal, setFormattedTotalSubtotal] =
    useState<string>('')

  useEffect(() => {
    const calculateTotalSubtotal = () => {
      const total = dataSource.reduce((total, item) => total + item.subtotal, 0)
      setTotalSubtotal(total)
      setFormattedTotalSubtotal(total.toLocaleString('id-ID'))
    }

    calculateTotalSubtotal()
  }, [dataSource])

  const [amountPaid, setAmountPaid] = useState<number | null>(null)

  const [piutang, setPiutang] = useState<number>(0)

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)

    if (!isNaN(value) && value <= totalSubtotal) {
      setAmountPaid(value)
    } else {
      alert('Jumlah bayar tidak boleh melebihi total tagihan')
    }
  }

  useEffect(() => {
    setPiutang((totalSubtotal || 0) - (amountPaid || 0))
  }, [totalSubtotal, amountPaid])

  const { fiAc } = useFiac()
  const [selectedBank, setSelectedBank] = useState<any | null>(null)
  const [status, setStatus] = useState<number | undefined>()

  const evaluateStatus = () => {
    if (amountPaid === null || amountPaid === 0) {
      return 1
    } else if (amountPaid > 0 && amountPaid < totalSubtotal) {
      return 2
    } else if (amountPaid === totalSubtotal) {
      return 3
    }
    return status
  }

  useEffect(() => {
    const newStatus = evaluateStatus()
    setStatus(newStatus)
  }, [amountPaid, totalSubtotal])

  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split('-')
    return `${year}-${month}-${day}`
  }
  const generateShortInvoiceId = (): string => {
    const uuid = uuidv4()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000
    return `INV${String(shortNumber).padStart(4, '0')}`
  }
  const [currentIdPos, setcurrentIdPos] = useState(generateShortInvoiceId())
  const stringInv = currentIdPos as any

  const [catatan, setCatatan] = useState('')

  const handleSave = () => {
    const saveTag = idDataTag.reduce((map: any, warehouse: any) => {
      map[warehouse.name] = warehouse.id
      return map
    }, {})
    const saveIdTag = saveTag[forTag as any]

    const accountMap = fiAc?.children?.reduce((map: any, warehouse: any) => {
      map[warehouse.name] = warehouse.id
      return map
    }, {})
    const accountId = accountMap[selectedBank as any]

    const saveNameContact = idContact.reduce((map: any, warehouse: any) => {
      map[warehouse.id] = warehouse.name
      return map
    }, {})
    const saveContactName = saveNameContact[selectedContact as any]
    const saveNamaGudang = idWarehouse.reduce((map: any, warehouse: any) => {
      map[warehouse.id] = warehouse.name
      return map
    }, {})
    const simpanGudang = saveNamaGudang[selectedWarehouseId as any]
    const invoiceData = {
      ref_number: currentIdPos,
      status_id: status,
      trans_date: formatDate(selectedDates[0]),
      due_date: formatDate(selectedDates[1]),
      contact_id: selectedContact,
      contact_shipping_address_id: null,
      // sales_id: 245773,
      sales_id: null,
      include_tax: 0,
      term_id: 1,
      memo: '',
      amount: totalSubtotal,
      amount_after_tax: 0,
      warehouse_id: selectedWarehouseId,
      attachment: [],
      items: dataSource.map((item) => ({
        finance_account_id: item.finance_account_id,
        name: item.finance_account_name,
        tax_id: null,
        desc: '',
        qty: item.qty,
        price: item.price,
        amount: item.subtotal,
        price_after_tax: item.price,
        amount_after_tax: 0,
        tax_manual: 0,
        discount_percent: 0,
        // unit_id: item.unit_id,
      })),
      witholdings: [
        {
          witholding_account_id: accountId,
          name: selectedBank,
          witholding_amount: 0,
          witholding_percent: 0,
        },
      ],
      contacts: [
        {
          id: selectedContact,
          name: saveContactName,
        },
      ],
      warehouses: [
        {
          warehouse_id: selectedWarehouseId,
          name: simpanGudang,
        },
      ],
      tages: [
        {
          id: saveIdTag,
          name: forTag,
        },
      ],
      due: piutang,
      down_payment: amountPaid || 0,
      down_payment_bank_account_id: accountId,
      witholding_account_id: accountId,
      message: catatan,
      tags: [saveIdTag],
      additional_discount_percent: 0,
      additional_discount_amount: 0,
      shipping_cost: 0,
      shipping_date: null,
      shipping_comp_id: null,
      shipping_tracking: null,
      delivery_ids: null,
      witholding_percent: 0,
      witholding_amount: 0,
      column_name: '',
    }

    saveInvoiceData(invoiceData)
    addPosMutation.mutate(invoiceData as any)
    // Navigate(`/detailkledo/${stringInv}`)
  }

  const columns = [
    {
      title: 'Barang',
      dataIndex: 'finance_account_id',
      key: 'finance_account_id',
      render: (id: any) => (
        <div>
          <Select
            showSearch
            placeholder="Barang"
            style={{ width: '320px' }}
            optionFilterProp="items"
            filterOption={(input, option) =>
              option?.items?.toString()
                ? option.items
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                : false
            }
            onChange={handleProductChange}
            defaultValue={id}
          >
            {barangs?.map((product) => (
              <Select.Option key={product.id} value={product.id}>
                <Badge
                  count={productQuantities[product.id] || 0}
                  overflowCount={Infinity}
                  style={{
                    backgroundColor: '#AF8700',
                    borderColor: '#AF8700',
                    color: 'white',
                  }}
                  offset={[159, 8]}
                >
                  <span style={{ paddingRight: '16px' }}>{product.name}</span>
                </Badge>
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
    },

    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (text: number, record: any) => (
        <div style={{ textAlign: 'center' }}>
          <div>{Math.floor(text).toLocaleString('id-ID')}</div>{' '}
          <Select
            defaultValue={record.selectedDiscount}
            style={{ width: '120px', fontSize: '12px', marginTop: '4px' }}
            onChange={(value) => handleDiscountChange(value, record)}
            bordered={false}
          >
            {discountRates.map((rate) => (
              <Select.Option key={rate.label} value={rate.label}>
                {rate.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      render: (text: any, record: any) => (
        <div>
          <Input
            type="number"
            value={text}
            min={1}
            style={{ textAlign: 'center' }}
            onChange={(e) => handleQtyChange(Number(e.target.value), record)}
          />
        </div>
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (text: number) => (
        <div style={{ textAlign: 'center' }}>
          {Math.floor(text).toLocaleString('id-ID')}
        </div>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Button
          type="primary"
          danger
          onClick={() => handleDelete(record.finance_account_id)}
        >
          Delete
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Row>
        <Col span={12}>
          <div style={{ marginBottom: '0px' }}>
            <Text strong>Piutang/Pelanggan:</Text>
          </div>
          <Title level={5} style={{ marginBottom: 0 }}>
            {formatRupiah(selectedReceivable)}
          </Title>
        </Col>
        <Col span={12}>
          <div style={{ marginBottom: '0px' }}>
            <Text strong>Piutang/Outlet:</Text>
          </div>
          <Title level={5}>{formatRupiah(totalReceivable)}</Title>
        </Col>
        <Col span={12}>
          <div style={{ marginBottom: '0px' }}>
            <Text strong>Platform:</Text>
          </div>
          <Title level={5}>{formatRupiah(400000000)}</Title>
        </Col>
      </Row>

      <Form.Item>
        <DateRange
          onChange={(dates) => {
            setSelectedDates(dates)
          }}
          onDifferenceChange={(diff) => {
            setSelectedDifference(diff)
          }}
          onSave={handleDateRangeSave}
        />
      </Form.Item>
      <div>
        <Select
          placeholder="Warehouse"
          showSearch
          style={{ width: '320px' }}
          optionFilterProp="items"
          filterOption={(input, option) =>
            option?.items?.toString()
              ? option.items
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
          onChange={handleWarehouseChange}
          value={selectedWarehouseId}
        >
          {idWarehouse?.map((warehouse) => (
            <Select.Option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          showSearch
          placeholder="Contact"
          style={{ width: '300px' }}
          optionFilterProp="items"
          filterOption={(input, option) =>
            (option?.items as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={selectedContact}
          onChange={handleContactChange}
        >
          {idContact
            ?.filter((contact: any) => {
              const match = contact.group_name === warehouseId

              return match
            })
            .map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Tag"
          showSearch
          style={{ width: '320px' }}
          optionFilterProp="items"
          filterOption={(input, option) =>
            option?.items?.toString()
              ? option.items
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
          onChange={handleTag}
          value={forTag}
        >
          {idDataTag?.map((product) => (
            <Select.Option key={product.id} value={product.id}>
              {product.name}
            </Select.Option>
          ))}
        </Select>

        <Input value={currentIdPos} style={{ width: '25%' }} />

        <Button
          type="primary"
          onClick={handleOkClick}
          style={{ marginTop: '10px' }}
        >
          OK
        </Button>
        <Select
          mode="multiple"
          placeholder="Barang"
          style={{ width: '100%', marginTop: '10px' }}
          optionFilterProp="items"
          filterOption={false}
          onChange={handleProductChange}
          value={selectedFinanceAccountIds}
          showSearch
          onSearch={handleSearch}
          open={dropdownVisible}
          onDropdownVisibleChange={(open) => setDropdownVisible(open)}
          dropdownRender={(menu) => (
            <div style={{ minWidth: '800px', padding: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  padding: '8px',
                  borderBottom: '1px solid #e8e8e8',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <span style={{ flex: 2, textAlign: 'left' }}>Nama Barang</span>
                <span style={{ flex: 1, textAlign: 'center' }}>Qty</span>
                <span style={{ flex: 1, textAlign: 'center' }}>Price</span>

                {discountRates.map((rate) => (
                  <span
                    key={rate.label}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    {rate.label}
                  </span>
                ))}
              </div>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {menu}
              </div>
            </div>
          )}
          tagRender={customDisplayRender as any}
        >
          {Array.isArray(barangs) &&
            barangs
              .filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((product) => (
                <Select.Option
                  key={product.id}
                  value={product.id}
                  label={product.id}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px',
                      borderBottom: '1px solid #e8e8e8',
                    }}
                  >
                    <span style={{ flex: 2, textAlign: 'left' }}>
                      {product.name}
                    </span>
                    <span style={{ flex: 1, textAlign: 'center' }}>
                      {productQuantities?.[product.id]}
                    </span>
                    <span style={{ flex: 1, textAlign: 'center' }}>
                      {product.price.toFixed(2)}
                    </span>

                    {discountRates.map((rate) => (
                      <span
                        key={rate.label}
                        style={{ flex: 1, textAlign: 'center' }}
                      >
                        {(
                          product.price -
                          (product.price * rate.percentage) / 100
                        ).toFixed(2)}
                      </span>
                    ))}
                  </div>
                </Select.Option>
              ))}
        </Select>

        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="finance_account_id"
          style={{ marginTop: '20px' }}
        />
        <Form style={{ marginTop: '16px', width: '20%' }}>
          <h3>Total : {totalSubtotal}</h3>
        </Form>
        <Form
          form={paymentForm}
          layout="vertical"
          style={{ marginTop: '16px', width: '20%' }}
        >
          <Form.Item
            label="Jumlah Bayar"
            rules={[{ required: true, message: 'Harap masukkan jumlah bayar' }]}
          >
            <Input
              type="number"
              value={amountPaid as any}
              onChange={handleAmountPaidChange}
              max={totalSubtotal}
            />
          </Form.Item>

          <Form.Item label="Sisa Tagihan">
            <Input type="number" value={piutang} />
          </Form.Item>
          <Select
            placeholder="Pilih bank"
            value={selectedBank as any}
            onChange={(value) => setSelectedBank(value)}
            style={{ marginTop: '16px', width: '100%' }}
          >
            {fiAc?.children?.map((e) => (
              <Select.Option key={e.id} value={e.name}>
                {e.name}
              </Select.Option>
            ))}
          </Select>
          <div>
            <Collapse
              // onChange={onChange}
              style={{
                width: '500px',
                textAlign: 'left',
                backgroundColor: '#f2f4f8',
              }}
            >
              <Panel header="Pesan" key="1">
                <TextArea
                  name="coba"
                  style={{
                    width: '100%',
                    minHeight: '50px',
                    border: '1px solid #cfcdcd',

                    backgroundColor: 'white',
                  }}
                  placeholder="Tambahkan pesan di sini..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </Panel>
            </Collapse>
          </div>

          <Form.Item>
            <Button
              onClick={handleSave}
              type="primary"
              style={{ marginTop: '10px' }}
              // disabled={limitizeTrans}
            >
              SIMPAN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default StockSelectorTable

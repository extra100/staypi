import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  useAddWarehouseTransferMutation,
  useGetWarehouseTransferByRefQuery,
  useUpdateWarehouseTransferMutation,
} from '../../hooks/pindahHooks'
import {
  Table,
  Typography,
  Row,
  Col,
  Button,
  InputNumber,
  message,
  Input,
} from 'antd'
import { useIdWarehouse } from './namaWarehouse'
import { useIdNamaBarang } from './NamaBarang'
import { useReactToPrint } from 'react-to-print'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useProductStocks } from './Po'
import { saveMutation } from './apiMutasi'
import UserContext from '../../contexts/UserContext'

const { Title, Text } = Typography

const SudahDivalidasi: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const idOutletLoggedIn = user ? String(user.id_outlet) : '0'
  const { error, success, saveInvoiceMutasi } = saveMutation()

  const { idaDataBarang } = useIdNamaBarang()
  const { ref_number } = useParams<{ ref_number: string }>()
  const { data: idWarehouseMonggo } = useGetWarehousesQuery()

  const { data: transferData } = useGetWarehouseTransferByRefQuery(ref_number!)
  console.log({ transferData })
  const transferArray = Array.isArray(transferData) ? transferData : []
  const transfer = transferArray[0] || {}
  const sumberData = transfer.items || []
  console.log({ sumberData })
  const warehouseMap: Record<any, any> = {}
  const formattedTransDate = new Date(transfer.trans_date).toLocaleString(
    'id-ID',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )
  if (idWarehouseMonggo && Array.isArray(idWarehouseMonggo)) {
    idWarehouseMonggo.forEach((warehouse) => {
      warehouseMap[warehouse.id] = warehouse.id
    })
  }
  const productMap: Record<number, string> = {}
  idaDataBarang.forEach((barang) => {
    productMap[barang.id] = barang.name
  })

  const fromWarehouseId =
    warehouseMap[transfer.from_warehouse_id] || transfer.from_warehouse_name
  const toWarehouseId =
    warehouseMap[transfer.to_warehouse_id] || transfer.to_warehouse_name

  //
  if (idWarehouseMonggo && Array.isArray(idWarehouseMonggo)) {
    idWarehouseMonggo.forEach((warehouse) => {
      warehouseMap[warehouse.id] = warehouse.name
    })
  }
  const productMapan: Record<number, string> = {}
  idaDataBarang.forEach((barang) => {
    productMap[barang.id] = barang.name
  })

  const fromWarehouseName =
    warehouseMap[transfer.from_warehouse_id] || transfer.from_warehouse_name
  const toWarehouseName =
    warehouseMap[transfer.to_warehouse_id] || transfer.to_warehouse_name
  const fromWarehouseCode = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseName
  )?.code
  const noContact = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseName
  )?.contact

  const [title, setTitle] = useState('TRANSFER . . . ')

  useEffect(() => {
    if (String(transfer.to_warehouse_name) === 'EXTRA TRUSS') {
      setTitle('TRANSFER GUDANG')
    } else {
      setTitle('TRANSFER PO')
    }
  }, [transfer.to_warehouse_name])

  const [transferQty, setTransferQty] = useState<number[]>([])

  // const handleTransferQtyChange = (value: number, index: number) => {
  //   setTransferQty((prevTransferQty) => {
  //     const updatedTransferQty = [...prevTransferQty]
  //     updatedTransferQty[index] = value
  //     return updatedTransferQty
  //   })
  // }

  const [dataSource, setDataSource] = useState<any[]>([])
  console.log({ dataSource })
  const combinedWarehouseIds = `${fromWarehouseId},${toWarehouseId}`
  const { stocks, loading } = useProductStocks(
    dataSource
      .map((row: any) => row.product_id)
      .filter(Boolean)
      .join(','),
    combinedWarehouseIds
  )
  const [fromQtyState, setFromQtyState] = useState<{ [key: number]: number }>(
    {}
  )

  const [toQtyState, setToQtyState] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    stocks.forEach((stock) => {
      const fromWarehouseStock = stock.stocks[fromWarehouseId]
      const toWarehouseStock = stock.stocks[toWarehouseId]

      const fromQty = fromWarehouseStock ? fromWarehouseStock.qty : 0
      const toQty = toWarehouseStock ? toWarehouseStock.qty : 0

      setFromQtyState((prev) => ({
        ...prev,
        [stock.id]: fromQty,
      }))

      setToQtyState((prev) => ({
        ...prev,
        [stock.id]: toQty,
      }))
    })
  }, [stocks, fromWarehouseId, toWarehouseId])
  useEffect(() => {
    if (transferData) {
      const initialDataSource = sumberData.map((item: any, index: number) => ({
        key: index,
        product_id: item.product_id,
        product_name: item.product_name,
        qty_minta: item.qty_minta,
        unit_name: item.unit_name,
        transferQty: 0,
        code: 2,
      }))
      setDataSource(initialDataSource)
    }
  }, [transferData])

  const generateSerialNumber = (productId: number): string => {
    const fromQty = fromQtyState[productId] || 0
    const toQty = toQtyState[productId] || 0

    return `${fromQty}**${toQty}`
  }
  const today = new Date()
  const formattedDate = today.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const columns = [
    {
      title: 'No',
      dataIndex: 'serial_number',
      key: 'serial_number',
      render: (_: any, record: any) => {
        const serialNumber = generateSerialNumber(record.product_id)
        return serialNumber
      },
    },
    {
      title: 'Item',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Qty',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
    },
    {
      title: 'Terima',
      dataIndex: 'qty',
      key: 'qty',
    },

    {
      title: 'Sat',
      dataIndex: 'unit_name',
      key: 'unit_name',
    },
  ]

  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  return (
    <div
      ref={componentRef}
      className="printable-component"
      style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}
    >
      <div ref={componentRef} className="print-container">
        <Title level={3} style={{ textAlign: 'center' }}>
          <span style={{ color: '#AF8700', fontSize: '20px' }}>{title}</span>
        </Title>

        {transferArray.length > 0 && (
          <>
            <Row
              style={{
                marginBottom: '16px',
                borderBottom: '1px dotted #AF8700',
                padding: '8px',
              }}
            >
              <Col span={24}>
                <Row>
                  <Col span={6}>
                    <Text>Referensi</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>: {transfer.ref_number}</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text>Dari</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Tanggal Validasi</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>: {formattedTransDate}</Text>
                  </Col>

                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text strong>{toWarehouseName}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <Text>Tanggal Print</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>: {formattedDate}</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Alamat Peminta</Text>
                  </Col>
                  <Col span={12}>
                    <Text italic>
                      : {fromWarehouseCode || '-'} {noContact || '-'}
                    </Text>
                  </Col>

                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text>Kepada</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Ket</Text>
                  </Col>
                  <Col span={12}>
                    <Text>: -</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text strong>{fromWarehouseName}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Table
              dataSource={sumberData}
              columns={columns as any}
              rowKey="_id"
              pagination={false}
              bordered
              style={{ marginTop: 20 }}
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
                        fontSize: '16px',
                        lineHeight: '1.2',
                        textAlign: 'center',
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
                    <td
                      {...restProps}
                      style={{ padding: '4px 8px', fontSize: '14px' }}
                    >
                      {children}
                    </td>
                  ),
                },
              }}
            />
            <div className="print-message">
              <Row style={{ marginTop: '0px', paddingTop: '1px' }}>
                <Col span={24}>
                  <Text>
                    Pesan: Barang sudah sesuai dengan jumlah fisik yang
                    diterima.
                  </Text>
                </Col>
              </Row>

              <Row
                // className="print-message"
                justify="space-between"
                style={{ marginTop: '32px', textAlign: 'center' }}
              >
                <Col span={8}>
                  <Text>Diperiksa Oleh</Text>
                  <br />
                  <br />
                  <Text>(...................................)</Text>
                </Col>
                <Col span={8}>
                  <Text>Diterima Oleh</Text>
                  <br />
                  <br />
                  <Text>(...................................)</Text>
                </Col>
                <Col span={8}>
                  <Text>Pengirim</Text>
                  <br />
                  <br />
                  <Text>(...................................)</Text>
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>
      <br />
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className="no-print" // Add this class
            onClick={handlePrint}
            style={{ color: '#AF8700', borderColor: '#AF8700' }}
          >
            Print Surat Jalan Mutasi
          </Button>
        </div>
      </div>
    </div>
  )
}
export default SudahDivalidasi

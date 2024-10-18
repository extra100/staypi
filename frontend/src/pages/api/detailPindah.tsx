import React, { useEffect, useRef, useState } from 'react'
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

const { Title, Text } = Typography

const WarehouseTransferDetail: React.FC = () => {
  const { error, success, saveInvoiceMutasi } = saveMutation()

  const { idaDataBarang } = useIdNamaBarang()
  const { ref_number } = useParams<{ ref_number: string }>()
  const { data: idWarehouseMonggo } = useGetWarehousesQuery()

  const { data: transferData } = useGetWarehouseTransferByRefQuery(ref_number!)
  const { mutate: updateWarehouseTransfer } =
    useUpdateWarehouseTransferMutation()

  const transferArray = Array.isArray(transferData) ? transferData : []
  const transfer = transferArray[0] || {}
  const items = transfer.items || []

  const warehouseMap: Record<any, any> = {}

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

  const fromWarehouseCode = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseId
  )?.code

  const [title, setTitle] = useState('TRANSFER . . . ')

  useEffect(() => {
    if (String(transfer.to_warehouse_name) === 'EXTRA TRUSS') {
      setTitle('TRANSFER GUDANG')
    } else {
      setTitle('TRANSFER PO')
    }
  }, [transfer.to_warehouse_name])

  const [transferQty, setTransferQty] = useState<number[]>([])
  console.log({ transferQty })
  const handleTransferQtyChange = (value: number, index: number) => {
    setTransferQty((prevTransferQty) => {
      const updatedTransferQty = [...prevTransferQty]
      updatedTransferQty[index] = value // Mengupdate nilai pada index tertentu
      return updatedTransferQty
    })
  }

  const [dataSource, setDataSource] = useState<any[]>([])
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
      const initialDataSource = items.map((item: any, index: number) => ({
        key: index,
        product_id: item.product_id,
        product_name: item.product_name,
        qty_minta: item.qty_minta,
        unit_name: item.unit_name,
        transferQty: 0, // Default value
      }))
      setDataSource(initialDataSource)
    }
  }, [transferData])

  console.log({ dataSource })

  const { mutate: addWarehouseTransfer } = useAddWarehouseTransferMutation()

  const handleSaveTransfer = async () => {
    const validRefNumber = ref_number || ''

    const transferData = {
      from_warehouse_id: fromWarehouseId,
      to_warehouse_id: toWarehouseId,
      trans_date: '2024-10-17',
      ref_number: validRefNumber,
      memo: '',
      code: 2,
      items: dataSource.map((row, index) => ({
        qty_minta: row.qty_minta,
        product_id: row.product_id,
        product_name: row.product_name,
        qty: transferQty[index] || 0,
        unit_name: row.unit_name,
        before_qty_dari: fromQtyState[row.product_id] || 0,
        before_qty_tujuan: toQtyState[row.product_id] || 0,
      })),
    }
    handlePrint()

    try {
      message.success('Data transfer berhasil disimpan!')

      updateWarehouseTransfer(
        { ref_number: validRefNumber, updatedData: transferData },
        {
          onSuccess: () => {
            message.success(
              'Data transfer berhasil diupdate berdasarkan ref_number!'
            )
          },
          onError: (error) => {
            message.error('Terjadi kesalahan saat mengupdate data transfer')
            console.error('Error:', error)
          },
        }
      )
    } catch (error) {
      message.error('Terjadi kesalahan saat menyimpan data transfer')
      console.error('Error:', error)
    }
  }
  const generateSerialNumber = (productId: number): string => {
    const fromQty = fromQtyState[productId] || 0
    const toQty = toQtyState[productId] || 0

    return `IPO${fromQty}**${toQty}`
  }
  const columns = [
    {
      title: 'Nomor',
      dataIndex: 'serial_number',
      key: 'serial_number',
      render: (_: any, record: any) => {
        const serialNumber = generateSerialNumber(record.product_id)
        return serialNumber
      },
    },
    {
      title: 'Barang',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Qty',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
    },
    // {
    //   title: 'Qty Gudang',
    //   dataIndex: 'qty_warehouse',
    //   key: 'qty_warehouse',
    //   className: 'hide-print',

    //   render: (_: any, record: any) => {
    //     const stockForProduct = stocks?.find(
    //       (stock: any) => Number(stock.id) === record.product_id
    //     )
    //     if (!stockForProduct || !stockForProduct.stocks) {
    //       return 'Stok kosong'
    //     }
    //     const fromWarehouseStock = stockForProduct.stocks[fromWarehouseId]
    //     const toWarehouseStock = stockForProduct.stocks[toWarehouseId]
    //     const fromQty = fromWarehouseStock ? fromWarehouseStock.qty : 0
    //     const toQty = toWarehouseStock ? toWarehouseStock.qty : 0

    //     return <span>{`From: ${fromQty} | To: ${toQty}`}</span>
    //   },
    // },
    {
      title: 'Satuan',
      dataIndex: 'unit_name',
      key: 'unit_name',
    },
    {
      title: 'Jumlah TF',
      dataIndex: 'transferQty',
      key: 'transferQty',
      render: (text: string, record: any, index: number) => (
        <Input
          type="number"
          value={transferQty[index] || 0}
          onChange={(e) =>
            handleTransferQtyChange(Number(e.target.value), index)
          }
        />
      ),
    },
  ]

  const componentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <div ref={componentRef} className="print-container">
        <Title level={3} style={{ textAlign: 'center' }}>
          <span style={{ color: '#AF8700', fontSize: '20px' }}>{title}</span>
        </Title>

        {transferArray.length > 0 ? (
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
                    <Text>Tanggal</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>: {transfer.trans_date}</Text>
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Text strong>{fromWarehouseId}</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Alamat Peminta</Text>
                  </Col>
                  <Col span={12}>
                    <Text italic>: {fromWarehouseCode || '-'}</Text>
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
                    <Text strong>{toWarehouseId}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Table
              dataSource={items}
              columns={columns}
              rowKey="_id"
              pagination={false}
              style={{ marginBottom: '0px' }}
            />

            <Row
              style={{
                marginTop: '0px',
                paddingTop: '1px',
              }}
            >
              <Col span={24}>
                <Text>
                  Pesan: Barang sudah sesuai dengan jumlah fisik yang diterima.
                </Text>
              </Col>
            </Row>

            <Row
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
          </>
        ) : (
          <Text>No data found</Text>
        )}
      </div>
      <br />

      <div style={{ textAlign: 'right' }}>
        <Button
          type="dashed"
          onClick={handleSaveTransfer}
          style={{
            marginBottom: '16px',
            backgroundColor: '#AF8700',
            borderColor: '#AF8700',
            color: '#ffffff',
            width: '300px',
          }}
        >
          + Print
        </Button>
      </div>
    </div>
  )
}

export default WarehouseTransferDetail

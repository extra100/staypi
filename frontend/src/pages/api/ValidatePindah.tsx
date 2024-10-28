import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
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
// import MutasiSuratJalan from './MutasiSuratJalan'

const { Title, Text } = Typography

const ValidatePindah: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const idOutletLoggedIn = user ? String(user.id_outlet) : '0'
  const { error, success, saveInvoiceMutasi } = saveMutation()

  const { idaDataBarang } = useIdNamaBarang()
  const { ref_number } = useParams<{ ref_number: string }>()
  const { data: idWarehouseMonggo } = useGetWarehousesQuery()

  const { data: transferData } = useGetWarehouseTransferByRefQuery(ref_number!)
  const { mutate: updateWarehouseTransfer } =
    useUpdateWarehouseTransferMutation()

  const transferArray = Array.isArray(transferData) ? transferData : []
  const transfer = transferArray[0] || {}
  const sumberData = transfer.items || []

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
  console.log({ fromWarehouseId })
  const toWarehouseId =
    warehouseMap[transfer.to_warehouse_id] || transfer.to_warehouse_name

  const fromWarehouseCode = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseId
  )?.code

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

  const fromWarehouseCodes = idWarehouseMonggo?.find(
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
      updatedTransferQty[index] = value
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
  const { mutate: addWarehouseTransfer } = useAddWarehouseTransferMutation()

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
  const navigate = useNavigate()

  const handleSaveTransfer = async () => {
    const validRefNumber = ref_number || ''

    const transferData = {
      from_warehouse_id: fromWarehouseId,
      to_warehouse_id: toWarehouseId,
      trans_date: '2024-10-26',
      ref_number: validRefNumber,
      memo: '',
      code: 2,

      items: dataSource.map((row, index) => ({
        qty_minta: row.qty_minta,
        code: row.code,
        product_id: row.product_id,
        finance_account_id: row.id,

        product_name: row.product_name,
        qty: transferQty[index] || 0,
        unit_name: row.unit_name,
        before_qty_dari: fromQtyState[row.product_id] || 0,
        before_qty_tujuan: toQtyState[row.product_id] || 0,
      })),
    }
    // handlePrint()
    saveInvoiceMutasi(transferData)

    try {
      message.success('Data transfer berhasil disimpan!')
      navigate(`/sudah-validasi/${ref_number}`)

      updateWarehouseTransfer(
        { ref_number: validRefNumber, updatedData: transferData },
        {
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
  const printSuratJalan = useRef<HTMLDivElement>(null)

  const printSuratJalanHandler = useReactToPrint({
    content: () => printSuratJalan.current,
  })

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
      title: 'Item',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Qty Permintaan',
      dataIndex: 'qty_minta',
      key: 'qty_minta',
    },
    ...(transferData?.code === 1
      ? [
          {
            title: 'Tervalidasi',
            dataIndex: 'qty',
            key: 'qty',
          },
        ]
      : []),

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
                    <Text>Referensi dasfsg</Text>
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
                    <Text strong>{fromWarehouseName}</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={6}>
                    <Text>Alamat Peminta</Text>
                  </Col>
                  <Col span={12}>
                    <Text italic>: {fromWarehouseCodes || '-'}</Text>
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
                    <Text strong>{toWarehouseName}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Table
              dataSource={sumberData}
              columns={columns as any}
              rowKey="_id"
              pagination={false}
              style={{ marginBottom: '0px' }}
            />

            {transferData?.code !== 2 && (
              <>
                <Row
                  style={{
                    marginTop: '0px',
                    paddingTop: '1px',
                  }}
                >
                  <Col span={24}>
                    <Text>
                      Pesan: Barang sudah sesuai dengan jumlah fisik yang
                      diterima.
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
                <div>
                  <button onClick={printSuratJalanHandler}>
                    Print Surat Jalan Mutasi
                  </button>
                  {/* <div style={{ display: 'none' }}>
                        <MutasiSuratJalan ref={printSuratJalan} />
                    </div> */}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Button
                    type="dashed"
                    onClick={handleSaveTransfer} // Fungsi untuk menyimpan
                    style={{
                      marginBottom: '16px',
                      backgroundColor: '#28a745', // Ubah warna jika perlu
                      borderColor: '#28a745',
                      color: '#ffffff',
                      width: '140px',
                    }}
                  >
                    Simpan
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
export default ValidatePindah
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetWarehouseTransferByRefQuery } from '../../hooks/pindahHooks'
import { Table, Typography, Row, Col, Button } from 'antd'
import { useIdWarehouse } from './namaWarehouse'
import { useIdNamaBarang } from './NamaBarang'
import { useReactToPrint } from 'react-to-print'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'

const { Title, Text } = Typography

const WarehouseTransferDetail: React.FC = () => {
  const { idWarehouse } = useIdWarehouse()
  const { idaDataBarang } = useIdNamaBarang()
  const { ref_number } = useParams<{ ref_number: string }>()
  const { data: idWarehouseMonggo } = useGetWarehousesQuery()

  const { data: transferData } = useGetWarehouseTransferByRefQuery(ref_number!)

  const transferArray = Array.isArray(transferData) ? transferData : []
  const transfer = transferArray[0] || {}
  const items = transfer.items || []

  const warehouseMap: Record<number, string> = {}

  // Check if idWarehouseMonggo is defined and is an array
  if (idWarehouseMonggo && Array.isArray(idWarehouseMonggo)) {
    idWarehouseMonggo.forEach((warehouse) => {
      warehouseMap[warehouse.id] = warehouse.name
    })
  }

  const productMap: Record<number, string> = {}
  idaDataBarang.forEach((barang) => {
    productMap[barang.id] = barang.name
  })

  const fromWarehouseName =
    warehouseMap[transfer.from_warehouse_id] || transfer.from_warehouse_name

  // Get the code of the warehouse based on the name
  const fromWarehouseCode = idWarehouseMonggo?.find(
    (warehouse) => warehouse.name === fromWarehouseName
  )?.code

  const toWarehouseName =
    warehouseMap[transfer.to_warehouse_id] || transfer.to_warehouse_name

  const [title, setTitle] = useState('TRANSFER . . . ')

  useEffect(() => {
    if (String(transfer.to_warehouse_name) === 'EXTRA TRUSS') {
      setTitle('TRANSFER GUDANG')
    } else {
      setTitle('TRANSFER PO')
    }
  }, [transfer.to_warehouse_name])

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Barang',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Satuan',
      dataIndex: 'unit_name',
      key: 'unit_name',
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
                    <Text strong>{fromWarehouseName}</Text>
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
                    <Text strong>{toWarehouseName}</Text>
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
          onClick={handlePrint}
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

import React, { forwardRef } from 'react'
import { Typography, Divider, Table, Row, Col } from 'antd'

const { Title, Text } = Typography

const Nota = forwardRef<HTMLDivElement>((props, ref) => {
  const emptyRows = Array.from({ length: 12 }, (_, index) => ({
    key: index,
  }))

  // Kolom tabel kosong
  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'key',
      render: (_: any, __: any, index: any) => index + 1,
      align: 'center',
      width: 2,
    },
    {
      title: 'Barang',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      render: () => '',
      width: 200,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      render: () => '',
      align: 'center',
      width: 20,
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: () => '',
      align: 'center',
      width: 90,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: () => '',
      align: 'center',
      width: 90,
    },
  ]

  return (
    <div
      ref={ref}
      style={{
        padding: 20,
        maxWidth: 700,
        background: '#fff',
        margin: 'auto',
        paddingTop: 10,
        paddingRight: 25,
      }}
    >
      <Row justify="center" align="middle">
        <Col span={6} style={{ textAlign: 'left' }}></Col>

        <Col span={18}>
          <Title level={4} style={{ textAlign: 'left' }}></Title>
          <Text style={{ display: 'block', textAlign: 'left' }}></Text>
        </Col>
      </Row>

      <br />
      <Row>
        <Col span={12}>
          <span> </span>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}></Col>

        <Col span={12} style={{ textAlign: 'left', display: 'flex' }}>
          <span>Pelanggan</span>
          <span style={{ marginLeft: '2%' }}>
            :.........................................
          </span>
        </Col>

        <Col span={12} style={{ textAlign: 'right' }}>
          <span>Tgl. Trans:........................ </span>
        </Col>
        <Col span={12} style={{ textAlign: 'left', display: 'flex' }}>
          <span>Sales</span>
          <span style={{ marginLeft: '12%' }}>
            :.........................................
          </span>
        </Col>

        <Col span={12} style={{ textAlign: 'right' }}>
          <span>Tgl. Jatuh Tempo:........................ </span>
        </Col>
      </Row>

      <Table
        pagination={false}
        bordered
        style={{ marginTop: 20 }}
        dataSource={emptyRows}
        columns={columns as any}
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
          <Text>....................</Text>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text strong style={{ minWidth: '120px', textAlign: 'left' }}>
              Total Tagihan:
            </Text>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text
              strong
              style={{ minWidth: '120px', textAlign: 'left' }}
            ></Text>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text strong style={{ minWidth: '120px', textAlign: 'left' }}>
              Total Bayar:
            </Text>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '3px',
            }}
          >
            <Text strong style={{ minWidth: '120px', textAlign: 'left' }}>
              Sisa Tagihan:
            </Text>
            <Text
              strong
              style={{ minWidth: '120px', textAlign: 'right' }}
            ></Text>
          </div>
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

export default Nota

import React, { useContext, useEffect, useState } from 'react'
import {
  Table,
  DatePicker,
  Row,
  Col,
  Typography,
  Select,
  Modal,
  Button,
} from 'antd'
import moment from 'moment'
import { TakeInvoicesFromKledoBasedOnDate } from '../takeInvoiceFromKledoBasedOnDate'
import { formatDate } from './FormatDate'
import {
  updateDenganMemoDariKledo,
  useGetFilteredTransaksisQuery,
} from '../../hooks/transactionHooks'
import {
  updateDenganIdUnikDariKledo,
  useGetTransactionByIdQuery,
} from '../../hooks/transactionHooks'
import { useNavigate, useParams } from 'react-router-dom'
const { Title } = Typography
const { Option } = Select
import dayjs from 'dayjs'
import UserContext from '../../contexts/UserContext'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import { useGetBarangsQuery } from '../../hooks/barangHooks'
import { TakeMutasiFromKledo } from '../TakeMutasiFromKledo'
import { useGetFilteredMutasisisQuery } from '../../hooks/pindahHooks'

const SuitMutasiExDanKledo: React.FC = () => {
  const navigate = useNavigate()

  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const [transDateFrom, setTransDateFrom] = useState<string | null>(
    dayjs().format('YYYY-MM-DD')
  )
  const [transDateTo, setTransDateTo] = useState<string | null>(
    dayjs().format('YYYY-MM-DD')
  )

  const handleDateFromChange = (date: dayjs.Dayjs | null) => {
    setTransDateFrom(date ? date.format('YYYY-MM-DD') : null)
  }

  const handleDateToChange = (date: dayjs.Dayjs | null) => {
    setTransDateTo(date ? date.format('YYYY-MM-DD') : null)
  }
  const { data: gudangdb } = useGetWarehousesQuery()
  const { data: barangs } = useGetBarangsQuery()
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(
    idOutletLoggedIn
  )
  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value)
  }
  useEffect(() => {
    const initialWarehouse = gudangdb?.find(
      (gudang: any) => gudang.id === idOutletLoggedIn
    )
    if (initialWarehouse) {
      setSelectedWarehouse(initialWarehouse.name)
    }
  }, [gudangdb, idOutletLoggedIn])

  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedData, setSelectedData] = useState<any | null>(null)
  const { ref_number } = useParams<{ ref_number?: string }>()
  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const { loading, getInvMutasiFromKledo } = TakeMutasiFromKledo(
    transDateFrom,
    transDateTo,
    selectedWarehouse
  )
  console.log({ getInvMutasiFromKledo })

  const { data: filteredTransaksiss, isLoading: loadingOwnDbs } =
    useGetFilteredMutasisisQuery({
      transDateFrom,
      transDateTo,
      selectedWarehouse,
    })
  console.log({ filteredTransaksiss })

  const handleStatusChange = (value: number) => {
    setSelectedStatus(value)
  }

  const handleRowClick = (record: any) => {
    const selectedTransaction = filteredTransaksiss?.find(
      (transaksi: any) => transaksi.id === record.id
    )

    if (!selectedTransaction) {
      console.error('Transaksi tidak ditemukan!')
      return
    }

    setSelectedData(selectedTransaction)
    setIsModalVisible(true)
  }

  const updateHanyaId = updateDenganMemoDariKledo()

  const memo =
    selectedData?.memo ||
    allTransactions?.find(
      (transaction: any) => transaction.id === selectedData?.id
    )?.memo

  const updateInvoiceId = async () => {
    if (!selectedData) {
      console.error('Tidak ada data yang dipilih untuk diperbarui.')
      return
    }

    const invoiceId = selectedData.id
    const idPadaItems =
      selectedData.items?.map((item: any) => ({
        id: item.id,
        finance_account_id: item.finance_account_id,
      })) || []

    console.log({ memo, invoiceId, idPadaItems })

    try {
      const response = await updateHanyaId.mutateAsync({
        memo,
        id: invoiceId,
        items: idPadaItems,
        witholdings: idPadaItems,
      })

      console.log('Invoice ID dan items berhasil diperbarui:', response)
    } catch (error) {
      console.error('Gagal memperbarui Invoice ID dan items:', error)
    }
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setSelectedData(null)
  }

  const columns = [
    {
      title: 'No',
      key: 'no',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Kledo',
      dataIndex: 'id_kledo',
      key: 'id_kledo',
      ellipsis: true,
    },
    {
      title: 'Wakanda',
      dataIndex: 'id_own_db',
      key: 'id_own_db',
      ellipsis: true,
    },
    {
      title: 'Inv',
      dataIndex: 'ref_number',
      key: 'ref_number',
      ellipsis: true,
    },
    {
      title: 'Tanggal Transaksi',
      dataIndex: 'trans_date',
      key: 'trans_date',
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Gudang',
      dataIndex: 'to_warehouse_id',
      key: 'warehouse_name',
      ellipsis: true,
      render: (to_warehouse_id: string) => {
        const warehouse = gudangdb?.find(
          (gudang: { id: any; name: any }) => gudang.id === to_warehouse_id
        )
        return warehouse ? warehouse.name : 'Unknown'
      },
    },
  ]

  const itemsColumns = [
    {
      title: 'Product',
      dataIndex: 'finance_account_id',
      key: 'product_name',
      ellipsis: true,
      render: (finance_account_id: string) => {
        const barang = barangs?.find(
          (gudang: { id: any; name: any }) => gudang.id === finance_account_id
        )
        return barang ? barang.name : 'Unknown'
      },
    },

    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
  ]

  const combinedData = [
    ...(getInvMutasiFromKledo?.map((row: any) => {
      const matchingRow = getInvMutasiFromKledo?.find(
        (transaksi) => transaksi.id === row.id
      )
      return {
        ...row,
        id_kledo: row.id,
        id_own_db: matchingRow?.id,
        isRed: !matchingRow,
      }
    }) ?? []),
    ...(filteredTransaksiss
      ?.filter(
        (transaksi) =>
          !getInvMutasiFromKledo?.some((row: any) => row.id === transaksi.id)
      )
      .map((transaksi: any) => ({
        ...transaksi,
        id_kledo: null,
        id_own_db: transaksi.id,
        isRed: true,
      })) ?? []),
  ]

  return (
    <div style={{ width: '800px', margin: '0 auto', padding: '20px' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24}>
          <Title level={4}></Title>
        </Col>
        <Col span={6}>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={handleDateFromChange as any}
            placeholder="Dari Tanggal"
            style={{ width: '100%' }}
            defaultValue={dayjs(transDateFrom, 'YYYY-MM-DD')}
          />
        </Col>
        <Col span={6}>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={handleDateToChange as any}
            placeholder="Sampai Tanggal"
            style={{ width: '100%' }}
            defaultValue={dayjs(transDateTo, 'YYYY-MM-DD')}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Pilih Gudang"
            onChange={handleWarehouseChange}
            value={selectedWarehouse}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            disabled={!user?.isAdmin} // Nonaktifkan Select jika user bukan admin
          >
            {gudangdb &&
              gudangdb.map((gudang: { id: any; name: any }) => (
                <Select.Option key={gudang.id} value={gudang.id}>
                  {gudang.name}
                </Select.Option>
              ))}
          </Select>
        </Col>
      </Row>
      <Table
        dataSource={combinedData}
        columns={columns}
        rowKey="ref_number"
        loading={loading || loadingOwnDbs}
        pagination={{ pageSize: 100 }}
        style={{ marginTop: '20px' }}
        rowClassName={(record) => (record.isRed ? 'red-row' : '')}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Modal
        title="Detail Data"
        visible={isModalVisible}
        onCancel={closeModal}
        footer={
          <Button
            onClick={() => {
              updateInvoiceId()
              navigate(`/sudah-validasi/${memo}`)
            }}
          >
            Sinkronkan
          </Button>
        }
        width={700}
      >
        {selectedData && (
          <div>
            <p>
              <strong>ID UNIK:</strong> {selectedData.id}
            </p>

            <p>
              <strong>No INV:</strong> {selectedData.ref_number}
            </p>

            <p>
              <text>Warehouse Name:</text>{' '}
              {gudangdb?.find(
                (gudang: { id: any; name: string }) =>
                  gudang.id === selectedData.warehouse_id
              )?.name || 'Unknown'}
            </p>

            <p>
              <strong>Pelanggan:</strong> {selectedData.name}
            </p>

            <p>
              <strong>Tgl Trans:</strong> {formatDate(selectedData.trans_date)}
            </p>
            <Table
              dataSource={selectedData.items}
              columns={itemsColumns}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SuitMutasiExDanKledo

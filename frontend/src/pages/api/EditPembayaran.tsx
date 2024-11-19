import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Table,
  Modal,
  Form,
  Input,
  Button,
  message,
  Popconfirm,
  Space,
} from 'antd'
import {
  useDeleteWitholdingMutation,
  useGetTransactionByIdQuery,
  useUpdateWitholdingMutation,
} from '../../hooks/transactionHooks'

const EditPembayaran = () => {
  const { ref_number } = useParams<{ ref_number?: string }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [form] = Form.useForm()

  const { mutate: updateWitholding, isLoading } = useUpdateWitholdingMutation()

  const handleEdit = (record: any) => {
    // Ambil ref_number dari objek transaksi utama
    const ref_number = record.ref_number

    // Sertakan ref_number ke dalam editingRecord
    setEditingRecord({ ...record, ref_number })

    // Set nilai form dengan data yang ada pada record
    form.setFieldsValue({
      trans_date: record.trans_date,
      down_payment: record.down_payment,
    })

    setIsModalVisible(true)
  }
  const { mutate: deleteWitholding, isLoading: isDeleting } =
    useDeleteWitholdingMutation()
  const handleDelete = async (record: any) => {
    if (!record._id || !ref_number) {
      message.error('Data tidak valid untuk dihapus.')
      return
    }

    console.log('ref_number:', ref_number)
    console.log('_id (witholdingId):', record._id)

    try {
      await deleteWitholding({
        ref_number: ref_number, // Ambil dari useParams
        witholdingId: record._id,
      })

      message.success('Data berhasil dihapus!')
    } catch (error) {
      console.error('Error saat menghapus:', error)
      message.error('Gagal menghapus data.')
    }
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      await updateWitholding({
        ref_number: ref_number as string,
        witholdingId: editingRecord?._id,
        trans_date: values.trans_date,
        down_payment: parseFloat(values.down_payment),
      })

      message.success('Data berhasil diperbarui!')
      setIsModalVisible(false)
      setEditingRecord(null)
    } catch (error) {
      console.error('Error saat update:', error)
      message.error('Gagal memperbarui data.')
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    setEditingRecord(null)
  }

  const paymentData = getPosDetail ? getPosDetail.witholdings : []
  console.log({ paymentData })
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Tanggal Bayar',
      dataIndex: 'trans_date',
      key: 'trans_date',
      render: (text: string) => text || '-',
    },
    {
      title: 'Jumlah Bayar',
      dataIndex: 'down_payment',
      key: 'down_payment',
      render: (value: number) => value.toLocaleString('id-ID'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus?"
            onConfirm={() => handleDelete(record)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="link" danger>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '20px', background: 'white' }}>
      <h2>Edit Pembayaran</h2>
      <Table columns={columns} dataSource={paymentData} rowKey="_id" />

      {/* Modal Edit */}
      <Modal
        title="Edit Pembayaran"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="trans_date"
            label="Tanggal Bayar"
            rules={[{ required: true, message: 'Tanggal bayar wajib diisi!' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="down_payment"
            label="Jumlah Bayar"
            rules={[{ required: true, message: 'Jumlah bayar wajib diisi!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default EditPembayaran

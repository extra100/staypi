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
import { TakePembayaranBankTrans } from '../TakePembayaranBankTrans'
import { HOST } from '../../config'
import TOKEN from '../../token'

const EditPembayaran = () => {
  // const { memorandum } = useParams<{ memorandum?: string }>()
  const { memorandum, bankId } = useParams<{
    memorandum: string
    bankId: string
  }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    memorandum as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === memorandum
  )
  const transDateUrl = getPosDetail?.trans_date
  const idBank = getPosDetail?.witholdings?.[0]?.witholding_account_id
  const tags = getPosDetail?.tages?.[0]?.id

  const [search, setSearch] = useState<any>({
    memorandum,
    bankId,
  })
  console.log({ search })

  const { getBankTrans } = TakePembayaranBankTrans(memorandum as any) || {
    getBankTrans: [],
  }
  console.log({ getBankTrans })

  const firstPayment =
    getBankTrans && getBankTrans.length > 0 ? getBankTrans[0] : null

  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false)
  const [isModalVisibleHapus, setIsModalVisibleHapus] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [erasingRecord, setErasingRecord] = useState<any>(null)
  const [form] = Form.useForm()

  const idControlEdit = getPosDetail?.witholdings?.find(
    (witholding: any) => witholding._id === editingRecord?._id
  )?.id

  const idControlHapus = getPosDetail?.witholdings?.find(
    (witholding: any) => witholding._id === erasingRecord?._id
  )?.id

  console.log({ idControlEdit })
  console.log({ idControlHapus })

  const { mutate: updateWitholding, isLoading } = useUpdateWitholdingMutation()
  const handleHapus = (record: any) => {
    const { _id, ref_number, trans_date, down_payment } = record

    setErasingRecord({ ...record, ref_number, _id })

    form.setFieldsValue({
      trans_date,
      down_payment,
    })

    setIsModalVisibleHapus(true)
  }
  const handleEdit = (record: any) => {
    const { _id, ref_number, trans_date, down_payment } = record

    setEditingRecord({ ...record, ref_number, _id })

    form.setFieldsValue({
      trans_date,
      down_payment,
    })

    setIsModalVisibleEdit(true)
  }

  const { mutate: deleteWitholding, isLoading: isDeleting } =
    useDeleteWitholdingMutation()

  const handleModalEditOk = async () => {
    let values: any

    try {
      values = await form.validateFields()

      await updateWitholding({
        ref_number: memorandum as string,
        witholdingId: editingRecord?._id,
        trans_date: values.trans_date,
        down_payment: parseFloat(values.down_payment),
      })

      const payload = {
        amount: parseFloat(values.down_payment),
        attachment: [],
        bank_account_id: idBank,
        business_tran_id: null,
        currency_rate: null,
        currency_source_id: 0,
        memo: memorandum as string,
        tags: [tags],
        trans_date: values.trans_date,
        withholdings: [],
      }
      console.log('Payload yang akan dikirim:', payload)

      console.log('Mengirim permintaan PUT ke API...')
      const response = await fetch(
        `${HOST}/finance/bankTrans/${idControlEdit}/invoicePayment`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      )
      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }
      console.log('Data berhasil dikirim ke Kledo.')

      message.success('Data berhasil diperbarui!')
      setIsModalVisibleEdit(false)
      setEditingRecord(null)
    } catch (error: any) {
      console.error('Terjadi error:', error)
      message.error('Terjadi kesalahan saat memperbarui data.')
    }
  }

  // const handleModalHapusOk = async () => {
  //   try {
  //     console.log('Menghapus data dari database...')
  //     if (!idControl || !memorandum) {
  //       message.error('Data tidak valid untuk dihapus.')
  //       return
  //     }

  //     await deleteWitholding({
  //       ref_number: memorandum as any,
  //       witholdingId: idControl as any,
  //     })

  //     message.success('Data berhasil dihapus dari database!')

  //     console.log('Menyiapkan permintaan DELETE ke API eksternal...')
  //     const response = await fetch(`${HOST}/finance/bankTrans/${idControl}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${TOKEN}`,
  //       },
  //     })

  //     console.log('Response status API eksternal:', response.status)

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status} - ${response.statusText}`)
  //     }

  //     message.success('Data berhasil dihapus dari API eksternal!')

  //     // Reset state/modal setelah berhasil
  //     setIsModalVisibleEdit(false)
  //     setErasingRecord(null)
  //   } catch (error: any) {
  //     console.error('Error saat menghapus:', error)
  //     message.error('Gagal menghapus data: ' + error.message)
  //   }
  // }

  const handleModalHapusOk = async () => {
    let values: any

    try {
      values = await form.validateFields()

      await deleteWitholding({
        ref_number: memorandum as string,
        witholdingId: erasingRecord?._id,
      })
      console.log('Data berhasil dikirim ke Wakanda.')

      console.log('Mengirim permintaan DELETE Kledo')
      const response = await await fetch(
        `${HOST}/finance/bankTrans/${idControlHapus}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }

      message.success('Data berhasil dihapus!')
      setIsModalVisibleHapus(false)
      setEditingRecord(null)
    } catch (error: any) {
      console.error('Terjadi error:', error)
      message.error('Terjadi kesalahan saat memperbarui data.')
    }
  }
  // const handleModalHapusOk = async (record: any) => {
  //   if (!idControl || !memorandum) {
  //     message.error('Data tidak valid untuk dihapus.')
  //     return
  //   }

  //   try {
  //     const response = await fetch(`${HOST}/finance/bankTrans/${idControl}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${TOKEN}`,
  //       },
  //     })

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status} - ${response.statusText}`)
  //     }
  //     await deleteWitholding({
  //       ref_number: memorandum,
  //       witholdingId: idControl as any,
  //     })
  //     message.success('Contact ID dan invoice berhasil diperbarui dengan items')
  //   } catch (innerError: any) {
  //     message.error(
  //       'Gagal memperbarui Contact ID dan invoice dengan items: ' +
  //         innerError.message
  //     )
  //     message.success('Data berhasil dihapus!')
  //   }
  // }

  const handleModalEditCancel = () => {
    setIsModalVisibleEdit(false)
    setEditingRecord(null)
  }
  const handleModalHapusCancel = () => {
    setIsModalVisibleHapus(false)
    setErasingRecord(null)
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
      title: 'ID BANK',
      dataIndex: 'witholding_account_id',
      key: 'witholding_account_id',
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
          <Button type="link" onClick={() => handleHapus(record)}>
            <Button type="link" danger>
              Hapus
            </Button>
          </Button>
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
        visible={isModalVisibleEdit}
        onOk={handleModalEditOk}
        onCancel={handleModalEditCancel}
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
      <Modal
        title="Hapus Pembayaran"
        visible={isModalVisibleHapus}
        onOk={handleModalHapusOk}
        onCancel={handleModalHapusCancel}
        confirmLoading={isLoading}
      ></Modal>
    </div>
  )
}

export default EditPembayaran

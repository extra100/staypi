import React, { useState } from 'react'
import { Button, Table, Typography, message, Spin } from 'antd'
import { useParams } from 'react-router-dom'

import {
  useGetTransactionByIdQuery,
  useUpdateWitholdingPercentMutation,
} from '../../hooks/transactionHooks'

const { Text } = Typography

const EditWitholdingPercentPage: React.FC = () => {
  const { ref_number } = useParams<{ ref_number: string }>()
  const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({})

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const witholdings = getPosDetail?.witholdings || []

  const updateWitholdingPercentMutation = useUpdateWitholdingPercentMutation()

  const handleVoid = (witholdingId: string, currentPercent: number) => {
    setLoadingIds((prev) => ({ ...prev, [witholdingId]: true }))

    const newPercent = currentPercent === 0 ? 1 : 0

    updateWitholdingPercentMutation.mutate(
      {
        ref_number: ref_number as string,
        witholdingId,
        newPercent,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            setLoadingIds((prev) => ({ ...prev, [witholdingId]: false }))
            message.success(
              currentPercent === 0
                ? 'Withholding percent updated to 1 (DIBATALKAN)!'
                : 'Withholding percent updated to 0 (BELUM DIBATALKAN)!'
            )
          }, 3000)
        },
        onError: () => {
          setLoadingIds((prev) => ({ ...prev, [witholdingId]: false }))
          message.error('Failed to update withholding percent!')
        },
      }
    )
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

  // Kolom untuk tabel
  const columns = [
    {
      title: 'Kas $ Bank',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tanggal Bayar',
      dataIndex: 'trans_date',
      key: 'trans_date',
    },
    {
      title: 'Jml. Bayar',
      dataIndex: 'down_payment',
      key: 'down_payment',
      render: (text: number) => <Text strong>{formatNumber(text)}</Text>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: any) => (
        <Text strong>
          {record.status === 0 ? 'BELUM DIBATALKAN' : 'DIBATALKAN'}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          onClick={() => handleVoid(record._id, record.status)}
          loading={loadingIds[record._id]}
        >
          {loadingIds[record._id] ? (
            <Spin size="small" />
          ) : record.status === 0 ? (
            'Void'
          ) : (
            'Unvoid'
          )}
        </Button>
      ),
    },
  ]

  return (
    <Table
      dataSource={witholdings}
      columns={columns}
      rowKey="_id"
      pagination={false}
    />
  )
}

export default EditWitholdingPercentPage

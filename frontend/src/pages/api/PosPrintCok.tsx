import React from 'react'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'
import { useParams } from 'react-router-dom'
import { Typography, Table } from 'antd'

const { Title } = Typography

const PosPrintKomponent: React.FC = () => {
  const { ref_number } = useParams<{ ref_number?: string }>()

  // Pass ref_number to the hook
  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )

  const transactionDetail = allTransactions?.find(
    (transaction) => transaction.ref_number === ref_number
  )

  const columns = [
    {
      title: 'Item ID',
      dataIndex: 'finance_account_id',
      key: 'finance_account_id',
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Satuan',
      dataIndex: 'unit_id',
      key: 'unit_id',
    },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <Title level={4}>Transaction Detail</Title>
      <Table
        dataSource={transactionDetail?.items || []}
        columns={columns}
        pagination={false}
        rowKey="_id"
      />
    </div>
  )
}

export default PosPrintKomponent

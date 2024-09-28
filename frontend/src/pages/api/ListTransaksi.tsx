import React from 'react'
import { Table } from 'antd'
import { useGetTransaksisQuery } from '../../hooks/transactionHooks'

const TransactionTable: React.FC = () => {
  const { data, isLoading, error } = useGetTransaksisQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

  const columns = [
    {
      title: 'Reference Number',
      dataIndex: 'ref_number',
      key: 'ref_number',
    },
    {
      title: 'Transaction Date',
      dataIndex: 'trans_date',
      key: 'trans_date',
    },
    {
      title: 'Term ID',
      dataIndex: 'term_id',
      key: 'term_id',
    },
    {
      title: 'Contact Name',
      dataIndex: ['contacts', 0, 'name'], // Access the first contact's name
      key: 'contact_name',
    },
    {
      title: 'Tags',
      dataIndex: ['tags', 0, 'name'], // Access the first tag's name
      key: 'tag_name',
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data?.map((transaction) => ({
        key: transaction.ref_number, // Key for each row
        ref_number: transaction.ref_number,
        trans_date: transaction.trans_date,
        term_id: transaction.term_id,
        contacts: transaction.contacts, // Contains contact details
        tags: transaction.tages, // Contains tag details
      }))}
      pagination={{ pageSize: 10 }} // Optional pagination
    />
  )
}

export default TransactionTable

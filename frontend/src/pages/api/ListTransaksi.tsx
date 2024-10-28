import React, { useContext, useEffect, useState } from 'react'
import { Button, Table } from 'antd'
import { useGetTransaksisQuery } from '../../hooks/transactionHooks'
import UserContext from '../../contexts/UserContext'
import { Navigate, useNavigate } from 'react-router-dom'

const TransactionTable: React.FC = () => {
  const { data, isLoading, error } = useGetTransaksisQuery()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<any | null>(
    null
  )
  //
  console.log({ selectedWarehouseId })
  useEffect(() => {
    if (user) {
      setSelectedWarehouseId(user.id_outlet)
    }
  }, [user])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

  // Filter transactions based on user.id_outlet
  const filteredData = data?.filter(
    (transaction) => transaction.warehouse_id === Number(user?.id_outlet)
  )

  const [activeButton, setActiveButton] = useState('')
  const navigate = useNavigate()

  const handleButtonClick = (value: any) => {
    setActiveButton(value)

    if (value === '1') {
      navigate('/listkledo')
    } else if (value === '2') {
      navigate('/listpindah')
    } else if (value === '3') {
      navigate('/listsudahdivalidasikeluar')
    } else if (value === '4') {
      navigate('/ListSudahValidasiMasuk')
    }
  }

  const columns = [
    {
      title: 'Reference Number hhhh',
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
    <>
      <div>
        <div
          id="btn-filter-status-container"
          style={{ display: 'inline-flex' }}
        >
          <Button
            id="btn-filter-2"
            value="2"
            type="default"
            className={activeButton === '2' ? 'btn-default-selected' : ''}
            style={{ borderRadius: '0px' }}
            onClick={() => handleButtonClick('2')}
          >
            <span>List Permintaan</span>
          </Button>
        </div>
        <Button
          id="btn-filter-1"
          value="1"
          type="default"
          className={activeButton === '1' ? 'btn-default-selected' : ''}
          style={{ borderRadius: '0px' }}
          onClick={() => handleButtonClick('1')}
        >
          <span>Validasi Permintaan</span>
        </Button>
        <Button
          id="btn-filter-1"
          value="1"
          type="default"
          className={activeButton === '3' ? 'btn-default-selected' : ''}
          style={{ borderRadius: '0px' }}
          onClick={() => handleButtonClick('3')}
        >
          <span>Sudah Divalidasi Keluar</span>
        </Button>
        <Button
          id="btn-filter-1"
          value="1"
          type="default"
          className={activeButton === '4' ? 'btn-default-selected' : ''}
          style={{ borderRadius: '0px' }}
          onClick={() => handleButtonClick('4')}
        >
          <span>Sudah Divalidasi Masuk</span>
        </Button>
        <Table
          columns={columns}
          dataSource={filteredData?.map((transaction) => ({
            key: transaction.ref_number, // Key for each row
            ref_number: transaction.ref_number,
            trans_date: transaction.trans_date,
            term_id: transaction.term_id,
            contacts: transaction.contacts, // Contains contact details
            tags: transaction.tages, // Contains tag details
          }))}
          pagination={false} // Optional pagination
        />
      </div>
    </>
  )
}

export default TransactionTable

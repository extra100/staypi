import { Input, Select, Form, Table, Button } from 'antd'
import React, { useContext, useState } from 'react'
import UserContext from '../../../contexts/UserContext'
import { useAddTransactionMutation } from '../../../hooks/transactionHooks'
import { useIdNamaBarang } from '../../api/NamaBarang'

const FinanceAccountSentToTable = () => {
  const addPosMutation = useAddTransactionMutation()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const { idaDataBarang } = useIdNamaBarang()
  const [selectedFinanceAccountId, setSelectedFinanceAccountId] = useState<
    number | null
  >(null)
  const [selectedFinanceAccountName, setSelectedFinanceAccountName] = useState<
    string | null
  >(null)
  const [dataSource, setDataSource] = useState<any[]>([])

  const handleFinanceAccountId = (value: number, option: any) => {
    setSelectedFinanceAccountId(value)
    setSelectedFinanceAccountName(option.children)
  }

  const handleAddToTable = () => {
    if (selectedFinanceAccountId && selectedFinanceAccountName) {
      setDataSource((prev) => [
        ...prev,
        {
          finance_account_id: selectedFinanceAccountId,
          finance_account_name: selectedFinanceAccountName,
        },
      ])
      setSelectedFinanceAccountId(null)
      setSelectedFinanceAccountName(null)
    }
  }

  const handleSave = () => {
    const invoiceData = {
      contact_id: 0,
      items: dataSource.map((item) => ({
        finance_account_id: item.finance_account_id,
        price: 2,
      })),
      witholdings: [
        {
          witholding_account_id: 34,
        },
      ],
      warehouse_id: 0,
    }

    addPosMutation.mutate(invoiceData as any, {
      onSuccess: (data) => {
        console.log('Transaction saved successfully:', data)
        setDataSource([])
      },
      onError: (error) => {
        console.error('Error saving transaction:', error)
      },
    })
  }

  const columns = [
    {
      title: 'Finance Account ID',
      dataIndex: 'finance_account_id',
      key: 'finance_account_id',
    },
    {
      title: 'Name',
      dataIndex: 'finance_account_name',
      key: 'finance_account_name',
    },
  ]

  return (
    <div className="my-select-container">
      <Select
        placeholder="Pilih Finance Account Id"
        showSearch
        style={{ width: '320px' }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children?.toString()
            ? option.children
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            : false
        }
        onChange={handleFinanceAccountId}
        value={selectedFinanceAccountId}
      >
        {idaDataBarang?.map((product) => (
          <Select.Option key={product.id} value={product.id}>
            {product.name}
          </Select.Option>
        ))}
      </Select>

      <Button onClick={handleSave} type="primary" style={{ marginTop: '10px' }}>
        Save to Database
      </Button>

      <Button
        onClick={handleAddToTable}
        type="default"
        style={{ marginTop: '10px', marginRight: '10px' }}
      >
        OK
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="finance_account_id"
        style={{ marginTop: '20px' }}
      />
    </div>
  )
}

export default FinanceAccountSentToTable

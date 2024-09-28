import { Input, Select, Table, Button, Tag } from 'antd'
import React, { useContext, useState } from 'react'
import UserContext from '../../../contexts/UserContext'
import { useAddTransactionMutation } from '../../../hooks/transactionHooks'
import { useIdNamaBarang } from '../../api/NamaBarang'

const FaSentToTableMark = () => {
  const addPosMutation = useAddTransactionMutation()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const { idaDataBarang } = useIdNamaBarang()
  const [selectedFinanceAccountIds, setSelectedFinanceAccountIds] = useState<
    number[]
  >([])
  const [dataSource, setDataSource] = useState<any[]>([])
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([])

  const handleFinanceAccountIdChange = (value: number[]) => {
    setTempSelectedIds(value)
  }

  const handleOkClick = () => {
    setDropdownVisible(false)
    const selectedItems = idaDataBarang.filter((item) =>
      tempSelectedIds.includes(item.id)
    )
    setDataSource((prev) => [
      ...prev,
      ...selectedItems
        .filter(
          (item) =>
            !prev.some(
              (existingItem) => existingItem.finance_account_id === item.id
            )
        )
        .map((item) => ({
          finance_account_id: item.id,
          finance_account_name: item.name,
          price: 2, // or any other default price
        })),
    ])
    setSelectedFinanceAccountIds(tempSelectedIds)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const customDisplayRender = (value: any) => {
    return ''
  }

  const handleSave = () => {
    const invoiceData = {
      contact_id: 0,
      items: dataSource.map((item) => ({
        finance_account_id: item.finance_account_id,
        price: item.price,
      })),
      witholdings: [
        {
          witholding_account_id: 34,
        },
      ],
      warehouse_id: 0,
    }

    addPosMutation.mutate(invoiceData as any)
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
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ]

  return (
    <div className="my-select-container">
      <Button type="primary" onClick={handleOkClick}>
        OK
      </Button>
      <Select
        mode="multiple"
        placeholder="Select one or more barang"
        onChange={handleFinanceAccountIdChange}
        value={tempSelectedIds}
        showSearch
        onSearch={handleSearch}
        filterOption={false}
        style={{ width: '100%' }}
        optionLabelProp="label"
        open={dropdownVisible}
        onDropdownVisibleChange={(open) => setDropdownVisible(open)}
        dropdownRender={(menu) => (
          <div style={{ minWidth: '800px', padding: '8px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                padding: '8px',
                borderBottom: '1px solid #e8e8e8',
              }}
            ></div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>{menu}</div>
          </div>
        )}
        tagRender={customDisplayRender as any}
      >
        {idaDataBarang
          .filter((item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((product) => (
            <Select.Option
              key={product.id}
              value={product.id}
              label={product.name}
            >
              {product.name}
            </Select.Option>
          ))}
      </Select>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="finance_account_id"
        style={{ marginTop: '20px' }}
      />
      <Button onClick={handleSave} type="primary" style={{ marginTop: '10px' }}>
        Save to Database
      </Button>
    </div>
  )
}

export default FaSentToTableMark

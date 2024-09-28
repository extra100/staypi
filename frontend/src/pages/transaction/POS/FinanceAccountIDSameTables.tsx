import { Input, Select, Form } from 'antd'
import React, { useContext, useState } from 'react'
import UserContext from '../../../contexts/UserContext'
import { useAddTransactionMutation } from '../../../hooks/transactionHooks'
import { useIdNamaBarang } from '../../api/NamaBarang'

const FinanceAccountIDSameTable = () => {
  const addPosMutation = useAddTransactionMutation()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const { idaDataBarang } = useIdNamaBarang()
  const [selectedFinanceAccountId, setSelectedFinanceAccountId] =
    useState<Number | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<Number | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<{
    id: number
    name: string
  } | null>(null)

  const handleFinanceAccountId = (value: Number, option: any) => {
    setSelectedFinanceAccountId(value)
    setSelectedPrice(option.price)
    setSelectedUnit(option.unit)
  }

  const handleSave = () => {
    const invoiceData = {
      contact_id: 0,
      items: [
        {
          finance_account_id: selectedFinanceAccountId,
          price: selectedPrice,
          unit: selectedUnit,
        },
      ],
      witholdings: [
        {
          witholding_account_id: selectedPrice,
        },
      ],
      warehouse_id: selectedPrice,
    }
    addPosMutation.mutate(invoiceData as any)
  }

  return (
    <div className="my-select-container">
      <Select
        placeholder="Pilih Finance Account Id"
        showSearch
        style={{ width: '100%' }}
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
      >
        {idaDataBarang?.map((product) => (
          <Select.Option
            key={product.id}
            value={product.id}
            price={product.price}
            unit={product.unit}
          >
            {`${product.unit?.id} - ${product.unit?.name} - ${product.name} - ${product.price}`}
          </Select.Option>
        ))}
      </Select>
      <button onClick={handleSave}>Save</button>
    </div>
  )
}

export default FinanceAccountIDSameTable

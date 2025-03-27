import { Input, Select, Form } from 'antd'
import React, { useContext, useState } from 'react'
import UserContext from '../../../contexts/UserContext'
import { useAddTransactionMutation } from '../../../hooks/transactionHooks'

import { useIdNamaBarang } from '../../api/NamaBarang'

const FinanceAccountId = () => {
  const addPosMutation = useAddTransactionMutation()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  //jik
  const { idaDataBarang } = useIdNamaBarang()
  const [selectedFinanceAccountId, setSelectedFinanceAccountId] =
    useState<Number | null>(null)
  const handleFinanceAccountId = (value: Number) => {
    setSelectedFinanceAccountId(value)
  }

  const handleSave = () => {
    const invoiceData = {
      contact_id: 0,
      items: [
        {
          finance_account_id: selectedFinanceAccountId,
          price: 2,
        },
      ],
      witholdings: [
        {
          witholding_account_id: 34,
        },
      ],
      warehouse_id: 0,
    }
    addPosMutation.mutate(invoiceData as any)
  }

  return (
    <div className="my-select-container">
      <Select
        placeholder="Pilih Finance Acoount Id"
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
      >
        {idaDataBarang?.map((product) => (
          <Select.Option key={product.id} value={product.id}>
            {product.name}
          </Select.Option>
        ))}
      </Select>
      <button onClick={handleSave}>Save</button>
    </div>
  )
}

export default FinanceAccountId

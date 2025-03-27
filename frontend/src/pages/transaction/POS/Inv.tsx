import { Input, Select } from 'antd'
import React, { useContext, useState } from 'react'
import UserContext from '../../../contexts/UserContext'

import { v4 as uuidv4 } from 'uuid'
import { useAddTransactionMutation } from '../../../hooks/transactionHooks'

const Inv = () => {
  const addPosMutation = useAddTransactionMutation()
  const generateShortInvoiceId = (): string => {
    const uuid = uuidv4()
    const last4OfUUID = uuid.substr(uuid.length - 4)
    const shortNumber = parseInt(last4OfUUID, 16) % 10000
    return `INV${String(shortNumber).padStart(4, '0')}`
  }
  const [currentIdPos, setcurrentIdPos] = useState(generateShortInvoiceId())

  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const handleSave = () => {
    const invoiceData = {
      trans_date: '2024-07-31',
      due_date: '2024-07-31',
      contact_id: 0,
      contact_shipping_address_id: null,
      sales_id: null,
      status_id: 1,
      include_tax: 0,
      term_id: 1,
      ref_number: currentIdPos,
      memo: '',
      attachment: [],
      items: [
        {
          finance_account_id: 3,
          tax_id: null,
          desc: '',
          qty: 1,
          price: 2,
          amount: 2,
          price_after_tax: 2,
          amount_after_tax: 2,
          tax_manual: 0,
          discount_percent: 0,
          unit_id: 1,
        },
      ],
      witholdings: [
        {
          witholding_account_id: 1,
          witholding_amount: 0,
          witholding_percent: 0,
        },
      ],
      warehouse_id: 0,
      additional_discount_percent: 0,
      additional_discount_amount: 0,
      message: '',
      tags: 0,

      shipping_cost: 0,
      shipping_date: null,
      shipping_comp_id: null,
      shipping_tracking: null,
      delivery_ids: null,

      witholding_percent: 0,
      witholding_amount: 0,
      witholding_account_id: 1,
    }
    addPosMutation.mutate(invoiceData as any)
  }

  return (
    <div
      style={{
        flex: '1',
        flexBasis: '20%',
        textAlign: 'left',
        marginLeft: '20px',
      }}
    >
      <div style={{ marginBottom: '8px' }}>Nomor</div>
      <Input
        value={currentIdPos}
        style={{ width: '100%' }}
        // disabled={!user?.isAdmin}
      />

      <button onClick={handleSave}>Save</button>
    </div>
  )
}

export default Inv

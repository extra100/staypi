import { Input, Select, Form } from 'antd'
import React, { useContext, useState } from 'react'
import UserContext from '../../../contexts/UserContext'
import { useAddTransactionMutation } from '../../../hooks/transactionHooks'
import { v4 as uuidv4 } from 'uuid'
import DateRange from '../../DateRange'

const Tanggal = () => {
  const addPosMutation = useAddTransactionMutation()
  const [selectedDates, setSelectedDates] = useState<[string, string]>(['', ''])
  const [selectedDifference, setSelectedDifference] = useState<number>(0)

  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const handleDateRangeSave = (
    startDate: string,
    endDate: string,
    difference: number
  ) => {
    setSelectedDates([startDate, endDate])
    setSelectedDifference(difference)
  }
  const handleSave = () => {
    const invoiceData = {
      trans_date: selectedDates[0],
      due_date: selectedDates[1],
      contact_id: 0,
      contact_shipping_address_id: null,
      sales_id: null,
      status_id: 1,
      include_tax: 0,
      term_id: 1,
      ref_number: 0,
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
        textAlign: 'right',
        marginBottom: '16px',
      }}
    >
      <div style={{ textAlign: 'left' }}>
        <Form.Item>
          <DateRange
            onChange={(dates) => {
              setSelectedDates(dates)
            }}
            onDifferenceChange={(diff) => {
              setSelectedDifference(diff)
            }}
            onSave={handleDateRangeSave}
          />
        </Form.Item>

        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}

export default Tanggal

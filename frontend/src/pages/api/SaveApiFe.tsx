import React from 'react'
import { SaveApi } from './SaveApi'

const SaveInvoiceComponent = () => {
  const { loading, error, success, saveInvoiceData } = SaveApi()

  const handleSave = () => {
    const invoiceData = {
      // business_tran_id: 176596,
      amount: 156499,
      amount_after_tax: 0,
      attachment: [],
      column_name: '',
      sales_id: 193769,
      user_id: 193769,

      contact_id: 3850,
      contacts: [
        {
          id: 3850,
          name: 'UD GLORY TRUSS',
        },
      ],
      down_payment: 145,
      down_payment_bank_account_id: 1471,
      due: 156354,
      due_date: '2024-11-10',
      include_tax: 0,
      items: [
        {
          amount: 156499,
          discount_amount: 41601,
          finance_account_id: 203,
          discount_percent: 21,
          desc: '',
          price: 78249.5,
          qty: 1,
          tax_id: null,
        },
      ],
      memo: '',
      message: '',
      ref_number: 'INV/GR/398477',

      status_id: 3,
      tags: [18],
      term_id: 1,
      trans_date: '2024-10-11',
      warehouse_id: 18,
      warehouses: [
        {
          warehouse_id: 18,
          name: 'GRAHA STEEL',
        },
      ],
      witholding_account_id: 1471,
      witholding_amount: 145,
      witholding_percent: 0,
      witholdings: [
        {
          witholding_account_id: 1471,
          name: 'KAS PENJUALAN_GRAHA STEEL',
          down_payment: 145,
        },
      ],
    }
    saveInvoiceData(invoiceData)
  }

  return (
    <div>
      <button onClick={handleSave} disabled={loading}>
        Save Invoice
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {success && <p>Invoice saved successfully!</p>}
    </div>
  )
}

export default SaveInvoiceComponent

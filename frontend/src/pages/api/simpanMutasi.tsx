import React from 'react'
import { saveMutation } from './apiMutasi'
import { SaveApi } from './SaveApi'

const SimpanMutasi = () => {
  const { loading, error, success, saveInvoiceMutasi } = saveMutation()

  const handleSave = () => {
    const invoiceData = {
      attachment: [],
      from_warehouse_id: 9,

      items: [
        {
          product_id: 998,
          qty: 1,
        },
      ],
      memo: null,
      message: '',
      ref_number: 'WT/EX/8659',

      to_warehouse_id: 8,

      trans_date: '2024-10-17',
    }
    saveInvoiceMutasi(invoiceData)
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

export default SimpanMutasi

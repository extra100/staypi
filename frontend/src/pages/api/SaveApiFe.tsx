import { message } from 'antd'
import React from 'react'
import { setTimeout } from 'timers'
import { useAddTransactionMutation } from '../../hooks/transactionHooks'
import { saveToApiNextPayment } from './NextPayment'
import { SaveApi } from './SaveApi'
import { SaveApiPemesananPenjualan } from './SaveApiPemesanan'

const SaveInvoiceComponent = () => {
  const saveInvoiceData = useAddTransactionMutation()

  const handleSave = () => {
    const invoiceData = {
      id: '199472',
      trans_date: '2024-11-02',
      jalur: 'pemesanan',
      due_date: '2024-11-02',
      unique_id: 85415,
      contact_id: 3771,
      amount: 5293,
      ref_transaksi: '0',
      down_payment: 0,
      reason_id: 'void',
      sales_id: null,
      status_id: 6,
      due: 5293,
      include_tax: 0,
      term_id: 1,
      ref_number: 'RO-7-03254',
      externalId: 0,
      memo: '',
      attachment: [],
      items: [
        {
          finance_account_id: 12,
          name: 'AMPLAS LEMBAR TAIYO #360',
          qty: 1,
          qty_update: 45,
          price: 5293,
          amount: 5293,
          discount_percent: 21,
          discount_amount: 1407,
        },
      ],
      witholdings: [
        {
          witholding_account_id: 1471,
          down_payment: 0,
          status: 0,
          name: 'KAS PENJUALAN_DUNIA GALVALUME',
          trans_date: '2024-11-02',
          witholding_amount: 0,
          witholding_percent: 0,
        },
      ],
      contacts: [
        {
          id: 3771,
          name: 'BAJA RINJANI',
        },
      ],
      warehouses: [
        {
          warehouse_id: 7,
          name: 'DUNIA GALVALUME',
        },
      ],
      warehouse_id: 7,
      message: '',
      tages: [
        {
          id: 6,
          name: 'DUNIA GALVALUME',
        },
      ],
      witholding_percent: 0,
      witholding_amount: 0,
      witholding_account_id: 1471,
    }
    saveInvoiceData.mutate(invoiceData as any, {
      onSuccess: () => {
        message.success('Transaksi berhasil disimpan!') // Tampilkan pesan sukses
      },
      onError: (error: any) => {
        message.error(`Terjadi kesalahan: ${error.message}`) // Tampilkan pesan error
      },
    })
  }

  return (
    <div>
      <button onClick={handleSave}>Save Invoice</button>
    </div>
  )
}

export default SaveInvoiceComponent

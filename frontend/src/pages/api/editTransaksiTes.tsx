import { useParams } from 'react-router-dom'

import { useState, useEffect } from 'react'
import { message } from 'antd'
import { HOST } from '../../config'
import TOKEN from '../../token'
import { useGetTransactionByIdQuery } from '../../hooks/transactionHooks'

export function KirimEditKeKledo() {
  const { ref_number } = useParams<{ ref_number?: string }>()
  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )

  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editSuccess, setEditSuccess] = useState(false)

  // Ambil id dari transaksi yang ditemukan
  const transactionId = getPosDetail?.id

  // Payload yang akan dikirim ke API
  const payload = {
    trans_date: '2024-11-12',
    due_date: '2024-11-26',
    amount: 25201,
    contact_id: 3723,
    contact_shipping_address_id: 'sdsRgrbdfgrrR',
    currency_rate: null,
    currency_source_id: 0,
    id: transactionId, // Gunakan id yang ditemukan
    include_tax: 0,
    items: [
      {
        finance_account_id: 744,
        qty: 2,
        tax_id: '',
        desc: null,
        unit_id: 15,
        price: 31900,
        amount: 25201,
        discount_amount: 6699,
        id: 374209,
      },
    ],
    message: null,
    ref_number,
    shipping_comp_id: null,
    shipping_cost: 0,
    shipping_date: null,
    shipping_tracking: null,
    tags: [18],
    term_id: 3,
    warehouse_id: 18,
  }

  const editDataKelod = async () => {
    if (!transactionId) {
      setEditError('Transaction ID tidak ditemukan')
      return
    }

    setEditLoading(true)
    setEditError(null)
    setEditSuccess(false)

    try {
      const response = await fetch(
        `${HOST}/finance/invoices/${transactionId}`, // Gunakan transactionId yang sudah didapat
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }

      const responseData = await response.json()
      console.log('Data yang diterima:', responseData)
      setEditSuccess(true)
      message.success('Transaksi berhasil dibatalkan!')
    } catch (error: any) {
      const errorMessage =
        error.message || 'Terjadi kesalahan saat edit invoice'
      setEditError(errorMessage)
      message.error(errorMessage)
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div>
      {editLoading && <p>Loading...</p>}
      {editError && <p>Error: {editError}</p>}
      {editSuccess && <p>Edit Sukses!</p>}
      <button onClick={editDataKelod}>Kirim Edit</button>
    </div>
  )
}
export default KirimEditKeKledo

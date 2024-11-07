import { useState } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'
import { message } from 'antd'

export function useVoidInvoice() {
  const [voidLoading, setVoidLoading] = useState(false)
  const [voidError, setVoidError] = useState<string | null>(null)
  const [voidSuccess, setVoidSuccess] = useState(false)

  const voidInvoice = async (invoiceId: string) => {
    // Menerima invoiceId sebagai parameter
    if (!invoiceId) {
      setVoidError('Invoice ID tidak ditemukan')
      return
    }

    setVoidLoading(true)
    setVoidError(null)
    setVoidSuccess(false)

    try {
      const response = await fetch(
        `${HOST}/finance/invoices/${invoiceId}/void`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Gagal melakukan void pada invoice')
      }

      const responseData = await response.json()
      setVoidSuccess(true)
      message.success('Transaksi berhasil dibatalkan!')
      console.log('Void invoice berhasil:', responseData)
    } catch (error: any) {
      const errorMessage =
        error.message || 'Terjadi kesalahan saat void invoice'
      setVoidError(errorMessage)
      message.error(errorMessage)
    } finally {
      setVoidLoading(false)
    }
  }

  return { voidInvoice, voidLoading, voidError, voidSuccess }
}

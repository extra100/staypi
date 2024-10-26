import { useState } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'
import { useIdInvoice } from './takeSingleInvoice'

export function useVoidInvoice(ref_number: string) {
  const { getIdAtInvoice } = useIdInvoice(ref_number)
  const [voidLoading, setVoidLoading] = useState(false)
  const [voidError, setVoidError] = useState<string | null>(null)
  const [voidSuccess, setVoidSuccess] = useState(false)

  const voidInvoice = async () => {
    if (!getIdAtInvoice || !getIdAtInvoice.id) {
      setVoidError('Invoice ID tidak ditemukan')
      return
    }

    setVoidLoading(true)
    setVoidError(null)
    setVoidSuccess(false)

    try {
      const response = await fetch(
        `${HOST}/finance/invoices/${getIdAtInvoice.id}/void`,
        {
          method: 'POST', // Bisa jadi method lain, tergantung dokumentasi API
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
      console.log('Void invoice berhasil:', responseData)
    } catch (error: any) {
      setVoidError(error.message || 'Terjadi kesalahan saat void invoice')
    } finally {
      setVoidLoading(false)
    }
  }

  return { voidInvoice, voidLoading, voidError, voidSuccess }
}

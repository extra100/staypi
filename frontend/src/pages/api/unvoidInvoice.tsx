import { useState } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'
import { useIdInvoice } from './takeSingleInvoice'

export function useUnvoidInvoice(ref_number: string) {
  const { getIdAtInvoice } = useIdInvoice(ref_number)
  const [unvoidLoading, setUnvoidLoading] = useState(false)
  const [unvoidError, setUnvoidError] = useState<string | null>(null)
  const [unvoidSuccess, setUnvoidSuccess] = useState(false)

  const unvoidInvoice = async () => {
    if (!getIdAtInvoice || !getIdAtInvoice.id) {
      setUnvoidError('Invoice ID tidak ditemukan')
      return
    }

    setUnvoidLoading(true)
    setUnvoidError(null)
    setUnvoidSuccess(false)

    try {
      const response = await fetch(
        `${HOST}/finance/invoices/${getIdAtInvoice.id}/unvoid`,
        {
          method: 'POST', // Bisa jadi method lain, tergantung dokumentasi API
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Gagal melakukan unvoid pada invoice')
      }

      const responseData = await response.json()
      setUnvoidSuccess(true)
      console.log('unvoid invoice berhasil:', responseData)
    } catch (error: any) {
      setUnvoidError(error.message || 'Terjadi kesalahan saat unvoid invoice')
    } finally {
      setUnvoidLoading(false)
    }
  }

  return { unvoidInvoice, unvoidLoading, unvoidError, unvoidSuccess }
}

import { useState } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export function saveToApiNextPayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const saveNextPayment = async (invoiceData: any) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`${HOST}/finance/bankTrans/invoicePayment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to save invoice data: ${errorData.message}`)
      }

      setSuccess(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    success,
    saveNextPayment,
  }
}

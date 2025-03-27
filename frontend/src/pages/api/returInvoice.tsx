import { useState } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export function SaveReturnInvoice() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const saveReturn = async (invoiceData: any) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    console.log('Sending invoice data:', invoiceData)

    try {
      const response = await fetch(`${HOST}/finance/returns`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const errorData = await response.json()
        console.log('Error response data:', errorData)
        throw new Error(`Failed to save invoice data: ${errorData.message}`)
      }

      console.log('Invoice data saved successfully')
      setSuccess(true)
    } catch (error: any) {
      console.error('Error saving invoice data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    success,
    saveReturn,
  }
}

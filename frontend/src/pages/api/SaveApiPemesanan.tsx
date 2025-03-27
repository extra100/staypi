import { useState } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export function SaveApiPemesananPenjualan() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const saveInvoiceData = async (invoiceData: any) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    console.log('Sending invoice data:', invoiceData) // Log invoice data before sending

    try {
      const response = await fetch(`${HOST}/finance/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json', // Ensure content type is set
        },
        body: JSON.stringify(invoiceData),
      })

      console.log('Response status:', response.status) // Log response status
      console.log('Response headers:', response.headers) // Log response headers

      if (!response.ok) {
        const errorData = await response.json()
        console.log('Error response data:', errorData) // Log error response data
        throw new Error(`Failed to save invoice data: ${errorData.message}`)
      }

      console.log('Invoice data saved successfully') // Log success message
      setSuccess(true)
    } catch (error: any) {
      console.error('Error saving invoice data:', error) // Log error details
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    success,
    saveInvoiceData,
  }
}

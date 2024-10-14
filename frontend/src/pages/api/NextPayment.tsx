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

    console.log('Data before saving:', invoiceData) // Log data before saving

    try {
      const response = await fetch(`${HOST}/finance/bankTrans/invoicePayment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json', // Ensure Content-Type header is set
        },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error saving data:', errorData) // Log error data if request fails
        throw new Error(`Failed to save invoice data: ${errorData.message}`)
      }

      const savedData = await response.json()
      console.log('Data after saving:', savedData) // Log data after saving

      setSuccess(true)
    } catch (error: any) {
      console.error('Error occurred:', error.message) // Log the error message
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

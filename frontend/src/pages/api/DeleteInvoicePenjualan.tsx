import { useState, useEffect } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'

export interface Invoice {
  id: number
  ref_number: string
}

export function useDeleteInvoice(id: number) {
  const [loading, setLoading] = useState(true)
  const [hapusLoading, setHapusLoading] = useState(false)

  const [isDeleted, setIsDeleted] = useState(false)

  useEffect(() => {
    const deleteData = async () => {
      try {
        // Check if data exists in sessionStorage
        const storedData = sessionStorage.getItem('getIdAtInvoice')
        if (storedData) {
          const parsedData: Invoice[] = JSON.parse(storedData)
          const matchedInvoice = parsedData.find((invoice) => invoice.id === id)

          if (matchedInvoice) {
            // Remove matched invoice from sessionStorage
            const updatedData = parsedData.filter(
              (invoice) => invoice.id !== id
            )
            sessionStorage.setItem(
              'getIdAtInvoice',
              JSON.stringify(updatedData)
            )
          }
        }

        // Perform DELETE request to the API
        const response = await fetch(`${HOST}/finance/invoices/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete data from API')
        }

        setIsDeleted(true)
      } catch (error) {
        console.error('Error deleting invoice:', error)
      } finally {
        setHapusLoading(false)
      }
    }

    if (id) {
      deleteData()
    }
  }, [id]) // Trigger delete operation only when id changes

  return { hapusLoading, isDeleted }
}

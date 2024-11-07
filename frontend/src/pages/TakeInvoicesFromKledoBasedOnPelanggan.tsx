import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../config'
import TOKEN from '../token'
import { TransaksiPolosan } from '../types/TransaksiPolosan'
export interface Contactee {
  contact_groups: number
}

export function TakeInvoicesFromKledoBasedOnPelanggan() {
  const [loading, setLoading] = useState(true)
  const [invoiceBasedOnPelanggan, setInvoiceBasedOnPelanggan] = useState<
    TransaksiPolosan[]
  >([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async (page: number) => {
      try {
        const responGudang = await fetch(
          `${HOST}/finance/invoices?per_page=400&page=${page}&contact_groups=9`,

          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!responGudang.ok) {
          throw new Error('Failed to fetch data from API')
        }

        const dataGudang = await responGudang.json()

        const newInvoices = dataGudang.data.data

        const filteredInvoices = newInvoices.filter(
          (invoice: TransaksiPolosan) => invoice.contact?.group_id === 9
        )

        setInvoiceBasedOnPelanggan((prev) => [...prev, ...filteredInvoices])

        if (!lastPage) {
          setLastPage(dataGudang.data.last_page)
        }

        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching invoices:', error)
      }
    }

    if (currentPage <= (lastPage || 1)) {
      fetchData(currentPage)
    }
  }, [currentPage, lastPage])

  useEffect(() => {
    if (currentPage < (lastPage || 1) && !loading) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [invoiceBasedOnPelanggan, loading, lastPage])

  const memoizedData = useMemo(
    () => invoiceBasedOnPelanggan,
    [invoiceBasedOnPelanggan]
  )

  return { loading, invoiceBasedOnPelanggan: memoizedData }
}

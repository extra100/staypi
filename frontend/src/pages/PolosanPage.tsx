import { useState, useEffect, useMemo } from 'react'
import { HOST } from '../config'
import TOKEN from '../token'
import { TransaksiPolosan } from '../types/TransaksiPolosan'

export function useIdInvoice() {
  const [loading, setLoading] = useState(true)
  const [allInvoices, setAllInvoices] = useState<TransaksiPolosan[]>([]) // Store semua invoice yang diambil
  const [currentPage, setCurrentPage] = useState(1) // Mulai dari halaman pertama
  const [lastPage, setLastPage] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async (page: number) => {
      try {
        // Menambahkan include_items=1 pada URL
        const responGudang = await fetch(
          `${HOST}/finance/invoices?per_page=400&page=${page}&include_items=1`,
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
        console.log({ dataGudang })
        const newInvoices = dataGudang.data.data

        setAllInvoices((prev) => [...prev, ...newInvoices])

        if (!lastPage) {
          setLastPage(dataGudang.data.last_page)
        }

        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Error fetching invoices:', error)
      }
    }

    // Fetch data for the current page
    if (currentPage <= (lastPage || 1)) {
      fetchData(currentPage)
    }
  }, [currentPage, lastPage])

  // When data for the current page is fetched, increment the page to fetch the next page
  useEffect(() => {
    if (currentPage < (lastPage || 1) && !loading) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [allInvoices, loading, lastPage])

  const memoizedData = useMemo(() => allInvoices, [allInvoices])

  return { loading, allInvoices }
}

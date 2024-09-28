import { useState, useEffect } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'

interface PropertyStokBarang {
  id: string
  warehouseId: number
  qty: number
  avg_price: number
}

interface StokBarangData {
  products: { id: string; name: string }[]
  warehouses: { id: number; name: string }[]
}

export const useStokBarang = () => {
  const [dataStokBarang, setDataStokBarang] =
    useState<PropertyStokBarang | null>(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [warehouses, setWarehouses] = useState<{ id: number; name: string }[]>(
    []
  )

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const productResponse = await fetch(`${HOST}/finance/products`)
        if (!productResponse.ok) {
          throw new Error('Failed to fetch products')
        }
        const productData = await productResponse.json()
        setProducts(productData.products)

        const warehouseResponse = await fetch(`${HOST}/finance/warehouses`)
        if (!warehouseResponse.ok) {
          throw new Error('Failed to fetch warehouses')
        }
        const warehouseData = await warehouseResponse.json()
        setWarehouses(warehouseData.warehouses)
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
      }
    }

    fetchDropdownData()
  }, [])

  const fetchStokBarang = async (id: string, warehouseId: number) => {
    setLoading(true)
    try {
      const url = `${HOST}/finance/products/stocks?product_ids=${id}`
      const productResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MmQ2MzFiMC0wZDFjLTQzNWItOGZkYS0yYWI4YmE2YzVkM2EiLCJqdGkiOiJlZDEwNjVlZTFjZjc2Y2IxOTI1NTIzNWU4YzE3YmE4NmNhM2JjMzc4Y2ZhNDRkYjk3NGQzMTA0YjRmZTE4NGI0NmUwZGUwYTlmNDBmY2FjYSIsImlhdCI6MTcyNDgwNTM0Ny41Mjc2MzMsIm5iZiI6MTcyNDgwNTM0Ny41Mjc2MzgsImV4cCI6MTcyNzM5NzM0Ny41MTI0MzEsInN1YiI6IjE5NDYyNyIsInNjb3BlcyI6WyJ3ZWIiLCJmaW5hbmNlIl19.AcCa2aLZemTJpWshwnnvG5906U0En3S_X1K2zMZ9K1JydmwFw2e8yjwwbnpSVBISXMIorLe48_juT_3mrRXENSIx3ek8xC1iAnkvpESzLfT0WuoE8HqhL2NjplobT3XL8ckYtybOE7txAG6rx7zmRKNcZI9NvUikuz5ALs-GlnWfIhs0F4CsXTUjeKWDJR8e6uT50-pXLHisBucby1JyIGQftUu1jHoKa3eKdLbqGoBbVlgERv2XEfyDbq4d-2T6Zfz_AgCHQfgqlOenY-qUzd-eY6-wmMydfB1P0kgqQ32Xf71aubK4mhEeYX-bKepN_6R7A0s7K6W2RDSAHnzd9jVDlNu8f4SvuB3YDxSkLbTktdL_pof_vVidGdK6rlqwK3QrpGIdUW4ErbuWd0MBiNaCkjxSc-87AxYXJjoHMTmX8kdkoYYKPZ8Z4te6SbpS9dNoYzllsZx_OZtry8dLg2KCSk5TlT0ztyGVXULSyCIZT4SnqYxwcvdyJ2kbbvG0sX_RyRxlKbfgoAEbAxqc5Ekf43QqMKeX8N96LXZJFlnHGlN2r223JUwW1ghWOWoVG2Gq1wGLGe6zd2RRHGLIhjbiPVvfcKdvUZxJ09bXJ07Lsa9ReJ7a9zBl8E1nMNe6oxdhK2jm2eyiVmniWRerMIGwLEAc0CHSJ60syeULWAQ`,
        },
      })
      if (!productResponse.ok) {
        throw new Error('Failed to fetch product data')
      }
      const { data } = await productResponse.json()
      const formattedData = data.map((item: any) => ({
        id: item.id,
        warehouseId: item.stocks[warehouseId].warehouse_id,
        qty: item.stocks[warehouseId].qty,
        avg_price: item.stocks[warehouseId].avg_price,
      }))[0]

      setDataStokBarang(formattedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return { dataStokBarang, loading, fetchStokBarang, products, warehouses }
}

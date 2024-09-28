import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'

export interface Unit {
  id: number
  name: string
}

export interface Warehouse {
  id: number
  name: string
  qty: number
  product: number
}

export interface Barang {
  id: number
  name: string
  price: number
  unit?: Unit // Optional to handle cases where unit might be missing
  warehouse_qty?: Warehouse[] // Changed to array to handle multiple warehouse quantities
}

export function useIdHa() {
  const [loading, setLoading] = useState(true)
  const [idHaha, setIdHaha] = useState<Barang[]>([])
  console.log({ idHaha })

  useEffect(() => {
    const fetchWarehouseQty = async () => {
      try {
        const storedData = sessionStorage.getItem('Barangs')
        if (storedData) {
          setIdHaha(JSON.parse(storedData))
          setLoading(false)
          return
        }

        const response = await fetch(`${HOST}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials',
          }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        const accessToken = data.access_token

        const bankTransResponse = await fetch(
          `${HOST}/finance/products?page=1&per_page=10`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YjdmMDI0YS01N2U4LTQ3MGItYWI3Yi1iMmMwZGE3OWU5ZDgiLCJqdGkiOiIwZDVjZWRlMGRmOTA1MmYwYjE4M2U1MjBjMDkwN2QwZjc5Nzc1NDJhYzdkYjY4NDZkNjY3NWJhMTFjNTFmNzRjZjViOGRkYjQwOTJjZmRlZSIsImlhdCI6MTcxMDc4MjUwNS41Mjg0NjgsIm5iZiI6MTcxMDc4MjUwNS41Mjg0NzEsImV4cCI6MTc0MjMxODUwNS41MTY5NjksInN1YiI6IjE5NDYyNyIsInNjb3BlcyI6W119.TI2y8gFarEQ7_Y3JIOdEIZCs_uEeMjHZFhJ8NWecDz-anMsoGBsTQjo2IH0YIJKpIeCLrWOLfto9MFNf5dUn-YovjcZRpsjLOAuXpTQ6mFATD2NX1yvDAlpr3GtoRE928OpWCdiNcEuhE-AXxmk_FrQxlRremdq2HcjzBDP_F4o3MzNzrh2JVdv7Ui4Q8cGRm2j2pFznNsn1uIYvvTYZN7QjMJxDwv8S6GpAYg01PiwKixVtXcRczax4sG9gVewVrtRo3MpZONNTfM2h1i7qi8rwjW1jSgNuY5afuTUAAMi9TpNenXX4GlXpgqUNjC8L79n6AhMoXEtWW9AJQQ7sHa9gMYs83W1gnVWHJKCj48Wak8K95L6fxxiw9_lcFZiQCHIlRzt_NyC5yR9o25mnf1SdDIEvhwWSgw3OvBzjHDC9dstMmlN-8g19tn4mWP0L1KMM5n4Qh0v2nacxgGfbjzcNPTaxhP29zgkxuIdh2oyzyhPugYys7S3sgtM2zahHdsBA9X452CvD6W14vY-ywvCWEIhAuzlQYsZdPqJddyz2_XJOhXxFiMfw9VfjRIExDb8oDKs08vT3hwFvHUqtIXevtv9Ch3buKdW8WDphHC8V6D3LdUR-0_yPMwyVeKISAwNND2ZOPqMdMS9fsJHIgvjLUqVnbP4mcI0uX_r3DX4`,
            },
          }
        )

        if (!bankTransResponse.ok) {
          throw new Error('Failed to fetch bank transactions')
        }

        const bankTransData = await bankTransResponse.json()
        console.log('Fetched data:', bankTransData) // Log the fetched data

        if (Array.isArray(bankTransData.data.data)) {
          const formattedData: Barang[] = bankTransData.data.data.map(
            (item: any) => {
              return {
                id: item.id,
                name: item.name,
                price: item.price,
                unit: item.unit
                  ? {
                      id: item.unit.id,
                      name: item.unit.name,
                    }
                  : undefined,
                warehouse_qty: Array.isArray(item.warehouse_qty)
                  ? item.warehouse_qty.map((wh: any) => ({
                      id: wh.id,
                      name: wh.name,
                      qty: wh.qty,
                      product: wh.product,
                    }))
                  : undefined,
              }
            }
          )

          setIdHaha(formattedData)
          sessionStorage.setItem('Barangs', JSON.stringify(formattedData))
        } else {
          console.error('Unexpected data structure:', bankTransData.data)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchWarehouseQty()
  }, [])

  const memoizedData = useMemo(() => idHaha, [idHaha])

  return { loading, idHaha: memoizedData }
}

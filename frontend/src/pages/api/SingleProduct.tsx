import { useState, useEffect } from 'react'
import { HOST } from '../../config'

export interface Product {
  id: number
  name: string
}

export function useIdProduct(productIds: string) {
  const [idProduct, setIdProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIdProduct = async () => {
      try {
        const response = await fetch(`${HOST}/finance/products/${productIds}`, {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MmQ2MzFiMC0wZDFjLTQzNWItOGZkYS0yYWI4YmE2YzVkM2EiLCJqdGkiOiIxMjQ3OTU4MzExMDE4NGVkYTIxMzkwMzYyMzNhMGEyZjI2ODE5MjcyMTNlN2QwZGZkM2M2OTQzYmJlMjg3ZGVjZmFlMDc0YmRhNDJlZTRiNyIsImlhdCI6MTcyNTg1NTQ2MS43OTYwNzgsIm5iZiI6MTcyNTg1NTQ2MS43OTYwODIsImV4cCI6MTcyODQ0NzQ2MS43ODQzNzIsInN1YiI6IjE5NDYyNyIsInNjb3BlcyI6WyJ3ZWIiLCJmaW5hbmNlIl19.mKmUzBRjo4GieuE8s1tQeWQebRNLHMRDj2bGmQpsoUW_gWVHxEuRSqpBYz0k0-m2xx4daoVTePH2dv5kS4CFwhGpPEP4r0_neYjsBw7OBSK2_T13nv7HTvLIvD1zakTggKG3W8vYwTn4q2aqyIOes3saivC_8PV7ELDxk21Cs2nGIDUGcM2sxnIhOHkKnhb2qfokBabLPvk4NC2fc5iB4PNlakKHGcKhf5uu06oVah4za7mGhbu-S8jlQqYW9453dXflAEaQpcxl4jIxtjiBazp0sr79B9GiSo_0bp4qhYGq1dpc49YXm1bQmz5ZdaxuZHXpivrZ0a0l8fLnstXHhnikXDb6BGpZzB6w23ncwiQO-eENmVvJ0FIqbFnUZdnnNZvmUzbPQ8_nFNiBd5wnJMlrCkvzIJXYJjSSHgRMR_LIQA-KmW-bEPZy2nLytAj34nOUeVmMOalkoZf90goL--hFV69esHpV_h8NlS4hmJ3P_Ns-cl4kCBIMg0FWKNx4JEpHMjslaVvB0b8UqccJ2U_cBj5OuStVFm6NC4JLkcNIuv1iDkVKhFP_qsH3J-FbTOpV5Kp87M70cDKH1SsUJZDEpj0lf-9r6fSx8DpNEh3OH8RGq-dP-pQq6QPCRbzEZP7JmsZYGvoKN5NRwvz2vkr1yQnLTklLzBX7wSf60F0`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }

        const responseData = await response.json()

        const dataProduct: Product = {
          id: responseData.data.id,
          name: responseData.data.name,
        }
        setIdProduct(dataProduct)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchIdProduct()
  }, [productIds])

  return { idProduct, loading }
}

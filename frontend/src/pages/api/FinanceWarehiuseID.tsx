import { useState } from 'react'
import { HOST } from '../../config'
import TOKEN from '../../token'
import { useIdNamaBarang } from './NamaBarang'

export const useStokWarehouse = () => {
  const [stokWarehouseId, setStokWarehouseId] = useState<any | null>(null)
  const { idaDataBarang } = useIdNamaBarang()

  const fetchWarehouseId = async (id: number) => {
    const url = `${HOST}/finance/warehouses/${id}`

    try {
      const productResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      const responseData = await productResponse.json()

      console.log('Fetched Data:', responseData)

      const filteredProducts = responseData.data.products.data.filter(
        (product: any) => idaDataBarang.includes(product.product_id)
      )

      if (filteredProducts.length > 0) {
        setStokWarehouseId({
          warehouseId: responseData.data.id,
          products: filteredProducts.map((product: any) => ({
            productId: product.product_id,
            qty: product.qty,
          })),
        })
      } else {
        setStokWarehouseId(null)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return { stokWarehouseId, fetchWarehouseId }
}

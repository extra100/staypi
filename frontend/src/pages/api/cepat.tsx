import React, { useState } from 'react'
import TOKEN from '../../token'

// Definisikan tipe data Product
interface Product {
  id: number
  name: string
  code: string
  base_price: number
  price: number
  qty: number
  is_track: boolean
  local_id: string
  bundle_type_id: number
  pos_product_category_id: number
  avg_base_price: number
  photos: string[]
  warehouse_qty: {
    id: number
    name: string
    qty: number
    product_val: number
  }[]
}

const ProductSearch: React.FC = () => {
  const [productName, setProductName] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value)
  }

  const fetchProducts = async (name: string) => {
    try {
      const response = await fetch(
        `http://alamat-api/finance/products?name=${name}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setProducts(data.data) // Asumsikan data yang diterima adalah objek yang memiliki properti `data`
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSearch = () => {
    fetchProducts(productName)
  }

  return (
    <div>
      <input
        type="text"
        value={productName}
        onChange={handleInputChange}
        placeholder="Masukkan Nama Barang"
      />
      <button onClick={handleSearch}>Cari</button>

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ProductSearch

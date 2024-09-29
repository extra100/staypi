import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'
import { Product } from '../../types/Product'
import {
  useAddProduct,
  useGetThenAddProductsQuery,
} from '../../hooks/productHooks'

const BatchProcessProducts = () => {
  const [offset, setOffset] = useState(0)
  const batchSize = 10
  const [isProcessing, setIsProcessing] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [productSet, setProductSet] = useState(new Set())

  const {
    data: products,
    refetch,
    isLoading,
  } = useGetThenAddProductsQuery(batchSize, offset)
  const addProductMutation = useAddProduct()

  useEffect(() => {
    if (!products || products.length === 0) return

    const newProducts = products.filter(
      (product) => !productSet.has(product.id)
    )
    setProductSet((prevSet) => {
      const updatedSet = new Set(prevSet)
      newProducts.forEach((product) => updatedSet.add(product.id))
      return updatedSet
    })

    // setAllProducts((prevProducts) => [...prevProducts, ...newProducts])

    if (products.length === batchSize) {
      setTimeout(() => setOffset((prevOffset) => prevOffset + batchSize), 500)
    }
  }, [products])

  useEffect(() => {
    if (offset > 0) {
      refetch()
    }
  }, [offset])

  const handleSave = async () => {
    setIsProcessing(true)

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize)

      for (const product of batch) {
        try {
          await addProductMutation.mutateAsync(product)
          console.log(`Successfully added product: ${product.name}`)
        } catch (error) {
          console.error(`Failed to add product: ${product.name}`, error)
        }
      }
    }

    setIsProcessing(false)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
  ]

  return (
    <div>
      <h1>Product List</h1>
      {isLoading ? (
        <Spin tip="Loading products..." />
      ) : (
        <Table
          dataSource={allProducts}
          columns={columns}
          rowKey="id"
          // pagination={true}
        />
      )}

      <Button
        type="primary"
        onClick={handleSave}
        disabled={isProcessing || isLoading}
        loading={isProcessing}
        style={{ marginTop: 16 }}
      >
        {isProcessing ? 'Saving...' : 'Save All Products'}
      </Button>
    </div>
  )
}

export default BatchProcessProducts

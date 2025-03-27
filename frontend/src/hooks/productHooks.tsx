import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Barang } from '../types/Barang'
import { Product } from '../types/Product'

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['barangs'],
    queryFn: async () => (await apiClient.get<Product[]>(`/api/barangs`)).data,
  })
export const useGetProductsQuerys = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string }[]
          meta: { total: number }
        }>('/api/products/products')

        return response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
  })

// Hooks untuk mengambil data barang
export const useGetBarangsQuery = () =>
  useQuery<Barang[], Error>({
    queryKey: ['barangs'],
    queryFn: async () => {
      try {
        // Mengambil data dari API
        const response = await apiClient.get<{
          data: Barang[]
          meta: { total: number }
        }>('/api/barangs')

        return response.data.data
      } catch (error) {
        console.error('Error fetching barangs:', error)
        throw new Error('Failed to fetch barangs')
      }
    },
  })

export const useGetThenAddProductsQuery = (batchSize: number, offset: number) =>
  useQuery({
    queryKey: ['products', batchSize, offset],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string }[]
          meta: { total: number }
        }>(`/api/products/products?limit=${batchSize}&offset=${offset}`)

        return response.data.data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
  })

export const useAddProduct = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (product: Product) => {
      return apiClient.post<Product>(`/api/products`, product)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
      },
    }
  )
}

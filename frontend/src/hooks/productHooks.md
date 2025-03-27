import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'

export const useGetProductsQuery = () =>
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

export const useAddProduct = () => {
const queryClient = useQueryClient()
return useMutation(
(regak: Product) => {
return apiClient.post<Product>(`/api/products`, regak)
},
{
onSuccess: () => {
queryClient.invalidateQueries(['products'])
},
}
)
}

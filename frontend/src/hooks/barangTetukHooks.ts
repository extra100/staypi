import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Barang } from '../types/Barang'
export const useGetBarangsQueryDb = () =>
  useQuery({
    queryKey: ['barangs'],
    queryFn: async () => (await apiClient.get<Barang[]>(`/api/barangs`)).data,
  })
export const useGetBarangsQuery = () =>
  useQuery({
    queryKey: ['barangs'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string }[]
          meta: { total: number }
        }>('/api/barangs/barangs')

        return response.data.data
      } catch (error) {
        console.error('Error fetching barangs:', error)
        throw error
      }
    },
  })

export const useGetThenAddBarangsQuery = (batchSize: number, offset: number) =>
  useQuery({
    queryKey: ['barangs', batchSize, offset],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string }[]
          meta: { total: number }
        }>(`/api/barangs/barangs?limit=${batchSize}&offset=${offset}`)

        return response.data.data
      } catch (error) {
        console.error('Error fetching barangs:', error)
        throw error
      }
    },
  })

export const useAddBarang = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (warehouse: Barang) => {
      return apiClient.post<Barang>(`/api/barangs`, warehouse)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['barangs'])
      },
    }
  )
}

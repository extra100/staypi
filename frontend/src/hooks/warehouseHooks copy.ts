import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Barang } from '../types/Barang'
import { Warehouse } from '../types/Warehouse'

export const useGetWarehousesQuery = () =>
  useQuery({
    queryKey: ['warehouses'],
    queryFn: async () =>
      (await apiClient.get<Warehouse[]>(`/api/warehouses`)).data,
  })
export const useGetWarehousesQuerys = () =>
  useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string; code: string }[]
          meta: { total: number }
        }>('/api/warehouses/warehouses')

        return response.data.data
      } catch (error) {
        console.error('Error fetching warehouses:', error)
        throw error
      }
    },
  })

export const useGetThenAddWarehousesQuery = (
  batchSize: number,
  offset: number
) =>
  useQuery({
    queryKey: ['warehouses', batchSize, offset],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string; code: string }[]
          meta: { total: number }
        }>(`/api/warehouses/warehouses?limit=${batchSize}&offset=${offset}`)

        return response.data.data
      } catch (error) {
        console.error('Error fetching warehouses:', error)
        throw error
      }
    },
  })

export const useAddWarehouse = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (warehouse: Warehouse) => {
      return apiClient.post<Warehouse>(`/api/warehouses`, warehouse)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['warehouses'])
      },
    }
  )
}

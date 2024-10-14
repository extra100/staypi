import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { AkunBank } from '../types/AkunBank'
export const useGetAkunBanksQueryDb = () =>
  useQuery({
    queryKey: ['akunbanks'],
    queryFn: async () =>
      (await apiClient.get<AkunBank[]>(`/api/akunbanks`)).data,
  })
export const useGetAkunBanksQuery = () =>
  useQuery({
    queryKey: ['akunbanks'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string }[]
          meta: { total: number }
        }>('/api/akunbanks/akunbanks')

        return response.data.data
      } catch (error) {
        console.error('Error fetching akunbanks:', error)
        throw error
      }
    },
  })

export const useGetThenAddAkunBanksQuery = (
  batchSize: number,
  offset: number
) =>
  useQuery({
    queryKey: ['akunbanks', batchSize, offset],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string }[]
          meta: { total: number }
        }>(`/api/akunbanks/akunbanks?limit=${batchSize}&offset=${offset}`)

        return response.data.data
      } catch (error) {
        console.error('Error fetching akunbanks:', error)
        throw error
      }
    },
  })

export const useAddAkunBank = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (warehouse: AkunBank) => {
      return apiClient.post<AkunBank>(`/api/akunbanks`, warehouse)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['akunbanks'])
      },
    }
  )
}

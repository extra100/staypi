import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Tag } from '../types/Tag'

export const useGetTagsQuery = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string }[]
          meta: { total: number }
        }>('/api/tags/tags')

        return response.data.data
      } catch (error) {
        console.error('Error fetching tags:', error)
        throw error
      }
    },
  })

export const useGetThenAddTagsQuery = (batchSize: number, offset: number) =>
  useQuery({
    queryKey: ['tags', batchSize, offset],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: { id: number; name: string }[]
          meta: { total: number }
        }>(`/api/tags/tags?limit=${batchSize}&offset=${offset}`)

        return response.data.data
      } catch (error) {
        console.error('Error fetching tags:', error)
        throw error
      }
    },
  })

export const useAddTag = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (warehouse: Tag) => {
      return apiClient.post<Tag>(`/api/tags`, warehouse)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tags'])
      },
    }
  )
}

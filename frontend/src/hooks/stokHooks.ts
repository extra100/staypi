import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Stok } from '../types/Stok'

export const useAddStokMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Stok) => apiClient.post<Stok>(`/api/stoks`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stoks'])
      },
    }
  )
}

export const useGetStoksQuery = () =>
  useQuery({
    queryKey: ['stoks'],
    queryFn: async () => (await apiClient.get<Stok[]>(`/api/stoks`)).data,
  })

export const useUpdateStokMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Stok) => apiClient.put<Stok>(`/api/stoks/${murah._id}`, murah),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['stoks'])
        queryClient.refetchQueries(['stoks'])
      },
    }
  )
}

export const useUpdateStokMutations = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (updatedStokku: Stok[]) => {
      const updatePromises = updatedStokku.map(async (stok) => {
        const response = await apiClient.put<Stok>(
          `/api/stoks/${stok._id}`,
          stok
        )
        return response.data
      })

      const updatedStokkuResult = await Promise.all(updatePromises)

      return updatedStokkuResult
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['stoks'])
        queryClient.refetchQueries(['stoks'])
      },
    }
  )
}

export const useDeleteStokMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/stoks/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stoks'])
      },
    }
  )
}

export const useImportStoksMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      return apiClient.post('/api/stoks/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['stoks'])
      },
    }
  )
}

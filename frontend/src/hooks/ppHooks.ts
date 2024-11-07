import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Pp } from '../types/Pp'
export const useGetPpsQuery = () =>
  useQuery({
    queryKey: ['pps'],
    queryFn: async () => (await apiClient.get<Pp[]>(`/api/pps`)).data,
  })
export const useGetPpByIdQuery = (ref_number: string) =>
  useQuery<Pp[]>(
    ['pps', ref_number],
    async () => (await apiClient.get<Pp[]>(`/api/pps/${ref_number}`)).data
  )
export const useGetPesoDetailQuery = (ref_number: string) => {
  return useQuery({
    queryKey: ['pps', ref_number],
    queryFn: async () =>
      (await apiClient.get<Pp[]>(`/api/pps/${ref_number}`)).data,
  })
}

export const useGetPpDetailQuery = (ref_number: string) => {
  return useQuery({
    queryKey: ['getPpDetail', ref_number],
    queryFn: async () =>
      (await apiClient.get<Pp[]>(`/api/pps/${ref_number}`)).data,
  })
}

export const useAddPpMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Pp) => {
      return apiClient.post<Pp>(`/api/pps`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pps'])
      },
    }
  )
}
type UpdatePpIdInput = { ref_number: string; id: number }

export const useUpdatePpMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ ref_number, id }: UpdatePpIdInput) => {
      return apiClient.put(`/api/pps/by-id/${ref_number}`, { id })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pps'])
      },
      onError: (error: any) => {
        console.error('Error updating id:', error)
      },
    }
  )
}

// export const useUpdatePpMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     async (updatedPp: Pp) => {
//       const { ref_number, ...updatedData } = updatedPp

//       return apiClient.put<Pp>(`/api/pps/${ref_number}`, updatedData)
//     },
//     {
//       onSuccess: () => {
//         // Invalidate queries to refetch the data after update
//         queryClient.invalidateQueries(['pps'])
//       },
//     }
//   )
// }

// export const useAddReturnMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (regak: Return) => {
//       const { _id, ...dataToSend } = regak

//       return apiClient.post<Return>(`/api/pps`, dataToSend)
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['returns'])
//       },
//     }
//   )
// }

// export const useDeletePpMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => {
//       const result = apiClient.delete(`/api/pps/${mahelnye}`)
//       result.catch((error) => {
//         console.error('Error saat menghapus:', error.response.data)
//       })

//       return result
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['pps'])
//       },
//     }
//   )
// }

export const useDeleteWitholdingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({
      ref_number,
      witholdingId,
    }: {
      ref_number: string
      witholdingId: string
    }) => {
      return apiClient.delete(
        `/api/pps/${ref_number}/witholdings/${witholdingId}`
      )
    },
    {
      onSuccess: (_, { ref_number }) => {
        queryClient.invalidateQueries(['pps', ref_number])
      },
    }
  )
}

export const useUpdateWitholdingPercentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async ({
      ref_number,
      witholdingId,
      newPercent,
    }: {
      ref_number: string
      witholdingId: string
      newPercent: number
    }) => {
      await apiClient.patch(
        `/api/pps/${ref_number}/witholding/${witholdingId}`,
        {
          status: newPercent,
        }
      )
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pps'])
      },
    }
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Transaction } from '../types/Transaction'
export const useGetTransaksisQuery = () =>
  useQuery({
    queryKey: ['transactions'],
    queryFn: async () =>
      (await apiClient.get<Transaction[]>(`/api/transactions`)).data,
  })
export const useGetTransactionByIdQuery = (ref_number: string) =>
  useQuery<Transaction[]>(
    ['transactions', ref_number],
    async () =>
      (await apiClient.get<Transaction[]>(`/api/transactions/${ref_number}`))
        .data
  )
export const useGetPesoDetailQuery = (ref_number: string) => {
  return useQuery({
    queryKey: ['transactions', ref_number],
    queryFn: async () =>
      (await apiClient.get<Transaction[]>(`/api/transactions/${ref_number}`))
        .data,
  })
}

export const useGetTransactionDetailQuery = (ref_number: string) => {
  return useQuery({
    queryKey: ['getTransactionDetail', ref_number],
    queryFn: async () =>
      (await apiClient.get<Transaction[]>(`/api/transactions/${ref_number}`))
        .data,
  })
}

export const useAddTransactionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Transaction) => {
      return apiClient.post<Transaction>(`/api/transactions`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions'])
      },
    }
  )
}

type UpdatePpIdInput = { ref_number: string; id: number }

export const updateDenganIdUnikDariKledo = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ ref_number, id }: UpdatePpIdInput) => {
      return apiClient.put(`/api/transactions/by-id/${ref_number}`, { id })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions'])
      },
      onError: (error: any) => {
        console.error('Error updating id:', error)
      },
    }
  )
}

export const useUpdateTransactionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: Transaction) => {
      // Pastikan endpoint URL sesuai dengan backend route yang sudah Anda definisikan
      return apiClient
        .put<Transaction>(
          `/api/transactions/full-update/${murahnye.ref_number}`,
          murahnye
        )

        .then((response) => {
          return response.data
        })
    },
    {
      onSuccess: () => {
        // Invalidate cache agar data diperbarui otomatis
        queryClient.invalidateQueries(['transactions'])
      },
      onError: (error: any) => {
        console.error('Error updating transaction:', error)
      },
    }
  )
}

type UpdateContactPayload = {
  ref_number: string
  contact_id: number
  term_id: number
  trans_date?: string // Trans_date from getPosDetail
  due_date?: string // Due_date from getPosDetail
}

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({
      ref_number,
      contact_id,
      term_id,
      trans_date,
      due_date,
    }: UpdateContactPayload) => {
      const response = await apiClient.put(
        `/api/transactions/by-contact_id/${ref_number}`,
        {
          contact_id,
          term_id,
          trans_date, // Use exact property name trans_date
          due_date, // Use exact property name due_date
        }
      )
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions'])
      },
      onError: (error: any) => {
        console.error('Error updating contact_id:', error)
      },
    }
  )
}

// export const useUpdateTransactionMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     async (updatedTransaction: Transaction) => {
//       const { ref_number, ...updatedData } = updatedTransaction

//       return apiClient.put<Transaction>(
//         `/api/transactions/${ref_number}`,
//         updatedData
//       )
//     },
//     {
//       onSuccess: () => {
//         // Invalidate queries to refetch the data after update
//         queryClient.invalidateQueries(['transactions'])
//       },
//     }
//   )
// }

// export const useAddReturnMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (regak: Return) => {
//       const { _id, ...dataToSend } = regak

//       return apiClient.post<Return>(`/api/transactions`, dataToSend)
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['returns'])
//       },
//     }
//   )
// }

// export const useDeleteTransactionMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (mahelnye: string) => {
//       const result = apiClient.delete(`/api/transactions/${mahelnye}`)
//       result.catch((error) => {
//         console.error('Error saat menghapus:', error.response.data)
//       })

//       return result
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['transactions'])
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
        `/api/transactions/${ref_number}/witholdings/${witholdingId}`
      )
    },
    {
      onSuccess: (_, { ref_number }) => {
        queryClient.invalidateQueries(['transactions', ref_number])
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
        `/api/transactions/${ref_number}/witholding/${witholdingId}`,
        {
          status: newPercent,
        }
      )
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions'])
      },
    }
  )
}

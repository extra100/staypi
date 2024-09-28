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

// export const useUpdateTransactionMutation = () => {
//   const queryClient = useQueryClient()

//   return useMutation(
//     (murahnye: Transaction) => {
//       return apiClient
//         .put<Transaction>(
//           `/api/transactions/${murahnye.ref_number}`,
//           murahnye
//         )
//         .then((response) => {
//           return response.data
//         })
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['transactions'])
//       },
//       onError: (error: any) => {
//         console.error('Error updating transaction:', error)
//       },
//     }
//   )
// }

export const useUpdateTransactionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (updatedTransaction: Transaction) => {
      try {
        const response = await apiClient.put<Transaction>(
          `/api/transactions/${updatedTransaction.ref_number}`,
          updatedTransaction
        )

        return response.data // Mengembalikan data dari respons
      } catch (error: any) {
        throw new Error(`Failed to update transaction: ${error.message}`)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions'])
      },
      onError: (error: Error) => {
        console.error('Mutation error:', error.message)
        // Anda bisa tambahkan handling error tambahan di sini
      },
    }
  )
}

export const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => {
      const result = apiClient.delete(`/api/transactions/${mahelnye}`)
      result.catch((error) => {
        console.error('Error saat menghapus:', error.response.data)
      })

      return result
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions'])
      },
    }
  )
}

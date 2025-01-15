import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Transaction } from '../types/Transaction'

interface UseTransactionsParams {
  transDateFrom?: string | null
  transDateTo?: string | null
  selectedWarehouse?: string | null
}

export const useGetFilteredTransaksisQuery = ({
  transDateFrom,
  transDateTo,
  selectedWarehouse,
}: UseTransactionsParams) =>
  useQuery({
    queryKey: [
      'transactions',
      { transDateFrom, transDateTo, selectedWarehouse },
    ],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (transDateFrom) params.append('date_from', transDateFrom)
      if (transDateTo) params.append('date_to', transDateTo)
      if (selectedWarehouse) params.append('warehouse_id', selectedWarehouse)

      const response = await apiClient.get<Transaction[]>(
        `/api/transactions?${params.toString()}`
      )

      const filteredData = response.data.filter(
        (transaction) => transaction.reason_id === 'unvoid'
      )

      return filteredData
    },
    enabled: Boolean(transDateFrom && transDateTo),
  })
  export const useGetTransactionsByContactQuery = (contact_id?: number) =>
    useQuery({
      queryKey: ['transactions', contact_id],
      queryFn: async () => {
        if (contact_id === undefined) {
          return [];
        }
        return (
          await apiClient.get<Transaction[]>(`/api/transactions/by-contact/${contact_id}`)
        ).data;
      },
      enabled: contact_id !== undefined, // Fetch data only if contact_id is provided
    });
  
  
export const useUpdateWitholdingMutation = () => {
  return useMutation(
    async ({
      ref_number,
      witholdingId,
      trans_date,
      down_payment,
    }: {
      ref_number: string
      witholdingId: string
      trans_date: string
      down_payment: number
    }) =>
      apiClient.put(
        `/api/transactions/${ref_number}/witholdings/${witholdingId}`,

        { trans_date, down_payment }
      )
  )
}
export const useUpdateTransactionMutationsss = () => {
  return useMutation(
    async (updateData: {
      ref_number: string
      trans_date: string
      down_payment: number
    }) => {
      const response = await apiClient.put(
        `/api/transactions/${updateData.ref_number}`,
        updateData
      )
      return response.data
    }
  )
}

export const useGetTransaksisQuery = () =>
  useQuery({
    queryKey: ['transactions'],
    queryFn: async () =>
      (await apiClient.get<Transaction[]>(`/api/transactions`)).data,
  })

// export const useGetTransaksisQuerymu = (warehouseId: any | null) =>
//   useQuery({
//     queryKey: ['transactions', warehouseId],
//     queryFn: async () => {
//       if (!warehouseId) {
//         console.log('No warehouseId provided')
//         return []
//       }

//       console.log('Fetching transactions for warehouseId:', warehouseId) // Debug
//       const response = await apiClient.get<Transaction[]>(
//         `/api/transactions?warehouseId=${Number(warehouseId)}`
//       )
//       console.log('Data from API:', response.data) // Debug data dari API
//       return response.data
//     },
//     enabled: !!warehouseId,
//   })
export const useGetTransaksisQuerymu = (
  warehouseId: any | null,
  startDate: string | null,
  endDate: string | null
) =>
  useQuery({
    queryKey: ['transactions', warehouseId, startDate, endDate], // Tambahkan `startDate` dan `endDate` dalam query key
    queryFn: async () => {
      if (!warehouseId || !startDate || !endDate) {
        console.log('No warehouseId, startDate, or endDate provided')
        return []
      }

      console.log(
        'Fetching transactions for warehouseId:',
        warehouseId,
        'from startDate:',
        startDate,
        'to endDate:',
        endDate
      ) // Debug
      const response = await apiClient.get<Transaction[]>(
        `/api/transactions?warehouseId=${Number(
          warehouseId
        )}&startDate=${startDate}&endDate=${endDate}`
      )
      console.log('Data from API:', response.data) // Debug data dari API
      return response.data
    },
    enabled: !!warehouseId && !!startDate && !!endDate, // Pastikan ketiga nilai ada sebelum query dijalankan
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

type UpdatePpIdInput = {
  ref_number: string
  id: number
  items?: {
    id: number // id item yang ingin diperbarui
    finance_account_id: number // id item yang ingin diperbarui
  }[]
}

export const updateDenganIdUnikDariKledo = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ ref_number, id, items }: any) => {
      return apiClient.put(`/api/transactions/by-id/${ref_number}`, {
        id,
        items,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions'])
      },
      onError: (error: any) => {
        console.error('Error updating ID and items:', error)
      },
    }
  )
}

export const updateDenganMemoDariKledo = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      memo,
      id,
      items,
      witholdings,
      amount, // Baru
      due, // Baru
    }: {
      memo: string;
      id: string;
      items: any[];
      witholdings: any[];
      amount: any; // Baru
      due: any; // Baru
    }) => {
      return apiClient.put(`/api/transactions/by-memo/${memo}`, {
        id,
        items,
        witholdings,
        amount, // Baru
        due, // Baru
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transactions']); // Refresh data setelah berhasil
      },
      onError: (error: any) => {
        console.error('Error updating data by memo:', error);
      },
    }
  );
};

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
  warehouse_id: number
  term_id: number
  id: number
  trans_date?: string // Trans_date from getPosDetail
  due_date?: string // Due_date from getPosDetail
  contacts?: { id: number }[]
  tages?: { id: number }[]
}

export const useUpdateContactMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async ({
      ref_number,
      contact_id,
      warehouse_id,
      term_id,
      id,
      trans_date,
      due_date,
      contacts,
      tages,
    }: UpdateContactPayload) => {
      const response = await apiClient.put(
        `/api/transactions/by-contact_id/${ref_number}`,
        {
          contact_id,
          warehouse_id,
          term_id,
          id,
          trans_date,
          due_date,
          contacts,
          tages,
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

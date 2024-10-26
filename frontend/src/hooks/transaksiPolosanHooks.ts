import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { TransaksiPolosan } from '../types/TransaksiPolosan'

export const useAddTransactionPolosanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: TransaksiPolosan) => {
      return apiClient.post<TransaksiPolosan>(`/api/transaksipolosans`, regak)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['transaksipolosans'])
      },
    }
  )
}

export const useFetchTransactions = (
  startDate: string,
  endDate: string,
  warehouseId?: any,
  contactId?: any
) => {
  return useQuery<TransaksiPolosan[], Error>(
    ['transaksiPolosan', startDate, endDate, warehouseId, contactId],

    async () => {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ...(warehouseId ? { warehouse_id: warehouseId, contactId } : {}), // Tambahkan warehouse_id hanya jika ada
      })

      const response = await apiClient.get(
        `/api/transaksipolosans?${queryParams.toString()}`
      )
      return response.data
    },
    {
      // Aktifkan query hanya ketika startDate dan endDate sudah ada
      enabled: !!startDate && !!endDate,
    }
  )
}

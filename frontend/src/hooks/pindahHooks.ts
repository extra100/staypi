import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { WarehouseTransfer } from '../types/Pindah'

export const useAddWarehouseTransferMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (transfer: WarehouseTransfer) =>
      apiClient.post<WarehouseTransfer>(`/api/pindah`, transfer),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pindah'])
      },
    }
  )
}

export const useGetWarehouseTransfersQuery = () => {
  return useQuery<WarehouseTransfer[], Error>(['pindah'], async () => {
    const response = await apiClient.get<WarehouseTransfer[]>(`/api/pindah`)
    return response.data
  })
}

export const useGetWarehouseTransferByRefQuery = (ref_number: string) => {
  return useQuery<WarehouseTransfer, Error>(
    ['pindah', ref_number],
    async () => {
      const response = await apiClient.get<WarehouseTransfer>(
        `/api/pindah/${ref_number}`
      )
      return response.data
    },
    {
      enabled: !!ref_number,
    }
  )
}

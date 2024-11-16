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
type UpdatePpIdInput = {
  ref_number: string
  id: number
  items?: {
    id: number // id item yang ingin diperbarui
    finance_account_id: number // id item yang ingin diperbarui
  }[]
}

export const updateDenganIdUnikMutasiDariKledo = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ ref_number, id, items }: UpdatePpIdInput) => {
      return apiClient.put(`/api/warehousetransfers/by-id/${ref_number}`, {
        id,
        items, // Sertakan items di dalam body request
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['warehousetransfers'])
      },
      onError: (error: any) => {
        console.error('Error updating ID and items:', error)
      },
    }
  )
}
export const useGetWarehouseTransferByRefQuery = (ref_number: string) => {
  return useQuery<WarehouseTransfer, Error>(
    ['pindah', ref_number],
    async () => {
      const response = await apiClient.get<WarehouseTransfer>(
        `/api/pindah/${ref_number}`
      )
      console.log('API Response:', response.data)

      return response.data
    }
  )
}
export const useUpdateWarehouseTransferMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    WarehouseTransfer,
    Error,
    { ref_number: string; updatedData: Partial<WarehouseTransfer> }
  >(
    async ({ ref_number, updatedData }) => {
      console.log('Sending updatedData:', updatedData) // Tambahkan log di sini

      const response = await apiClient.put<WarehouseTransfer>(
        `/api/pindah/${ref_number}`,
        updatedData
      )
      return response.data
    },
    {
      onSuccess: (data, { ref_number }) => {
        queryClient.invalidateQueries(['pindah', ref_number])
      },
    }
  )
}

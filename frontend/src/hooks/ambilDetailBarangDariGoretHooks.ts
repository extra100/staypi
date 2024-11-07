import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { AmbilDetailBarangDariGoretType } from '../types/AmbilDetailBarangDariGoretoType'

export const useAmbilDetailBarangGoretsQuery = () =>
  useQuery({
    queryKey: ['ambidetailbarangdarigorets'],
    queryFn: async () =>
      (
        await apiClient.get<AmbilDetailBarangDariGoretType[]>(
          `/api/ambidetailbarangdarigorets`
        )
      ).data,
  })

// Update the query hook to filter based on warehouse_id
// export const useAmbilDetailBarangGoretsGudangdanQuery = (
//   selectedWarehouseId: number | null
// ) =>
//   useQuery({
//     queryKey: ['ambildetailbarangdarigorets', selectedWarehouseId],
//     queryFn: async () => {
//       const response = await apiClient.get<AmbilDetailBarangDariGoretType[]>(
//         `/api/ambidetailbarangdarigorets/${selectedWarehouseId}`,
//         { params: { warehouse_id: selectedWarehouseId } }
//       )
//       return response.data
//     },
//     enabled: Boolean(selectedWarehouseId), // Only fetch if selectedWarehouseId is provided
//   })

export const useAmbilDetailBarangGoretsGudangdanQuery = (
  selectedWarehouseId: number | null
) =>
  useQuery({
    queryKey: ['ambildetailbarangdarigorets', selectedWarehouseId],
    queryFn: async () => {
      const response = await apiClient.get<AmbilDetailBarangDariGoretType[]>(
        `/api/ambidetailbarangdarigorets`,
        { params: { warehouse_id: selectedWarehouseId } }
      )
      return response.data
    },
    enabled: Boolean(selectedWarehouseId),
  })

export const useSimpanDetailBarangDariGoretMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: AmbilDetailBarangDariGoretType) =>
      apiClient.post<AmbilDetailBarangDariGoretType>(
        `/api/ambidetailbarangdarigorets`,
        regak
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ambidetailbarangdarigorets'])
      },
    }
  )
}

export const useUpdateDetailBarangDariGoretMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: AmbilDetailBarangDariGoretType) =>
      apiClient.put<AmbilDetailBarangDariGoretType>(
        `/api/ambidetailbarangdarigorets/${murah._id}`,
        murah
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ambidetailbarangdarigorets'])
      },
    }
  )
}

export const useDeleteDetailBarangDariGoretMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) =>
      apiClient.delete(`/api/ambidetailbarangdarigorets/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ambidetailbarangdarigorets'])
      },
    }
  )
}

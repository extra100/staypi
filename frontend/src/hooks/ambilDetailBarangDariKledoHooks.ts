import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { AmbilDetailBarangDariKledoType } from '../types/AmbilDetailBarangDariKledoType'

export const useAmbilDetailBarangKledosQuery = () =>
  useQuery({
    queryKey: ['ambidetailbarangdarikledos'],
    queryFn: async () =>
      (
        await apiClient.get<AmbilDetailBarangDariKledoType[]>(
          `/api/ambidetailbarangdarikledos`
        )
      ).data,
  })

export const useSimpanDetailBarangDariKledoMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: AmbilDetailBarangDariKledoType) =>
      apiClient.post<AmbilDetailBarangDariKledoType>(
        `/api/ambidetailbarangdarikledos`,
        regak
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ambidetailbarangdarikledos'])
      },
    }
  )
}

export const useUpdateDetailBarangDariKledoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: AmbilDetailBarangDariKledoType) =>
      apiClient.put<AmbilDetailBarangDariKledoType>(
        `/api/ambidetailbarangdarikledos/${murah._id}`,
        murah
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ambidetailbarangdarikledos'])
      },
    }
  )
}

export const useDeleteDetailBarangDariKledoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) =>
      apiClient.delete(`/api/ambidetailbarangdarikledos/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ambidetailbarangdarikledos'])
      },
    }
  )
}

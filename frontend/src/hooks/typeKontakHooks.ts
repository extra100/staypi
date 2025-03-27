import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { TypeKontak } from '../types/TypeKontak'

export const useGetTypeKontaksQuery = () =>
  useQuery({
    queryKey: ['typekontaks'],
    queryFn: async () =>
      (await apiClient.get<TypeKontak[]>(`/api/typekontaks`)).data,
  })

export const useAddTypeKontakMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: TypeKontak) =>
      apiClient.post<TypeKontak>(`/api/typekontaks`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['typekontaks'])
      },
    }
  )
}

export const useUpdateTypeKontakMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murahnye: TypeKontak) =>
      apiClient.put<TypeKontak>(`/api/typekontaks/${murahnye._id}`, murahnye),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['typekontaks'])
      },
    }
  )
}

export const useDeleteTypeKontakMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahelnye: string) => apiClient.delete(`/api/typekontaks/${mahelnye}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['typekontaks'])
      },
    }
  )
}

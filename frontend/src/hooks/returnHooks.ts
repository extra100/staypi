import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Return } from '../types/Return'

export const useAddReturnMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (regak: Return) => {
      const { sales_id, ...dataToSend } = regak
      console.log('Data to Send:', dataToSend)

      return apiClient.post<Return>(`/api/returns`, dataToSend)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returns'])
      },
    }
  )
}

export const useGetReturnssQuery = () =>
  useQuery({
    queryKey: ['returns'],
    queryFn: async () => (await apiClient.get<Return[]>(`/api/returns`)).data,
  })

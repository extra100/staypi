import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Return } from '../types/Return'

export const useAddReturnMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (regak: Return) => {
      const { _id, ...dataToSend } = regak
      console.log('Data to Send:', dataToSend)

      return apiClient.post<Return>(`/api/transactions`, dataToSend)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['returns'])
      },
    }
  )
}

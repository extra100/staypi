import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
export const useGetControlQuery = () =>
  useQuery({
    queryKey: ['controls'],
    queryFn: async () => (await apiClient.get<Control[]>(`/api/controls`)).data,
  })

export type Control = {
  _id: string
  name: string
}
export const useUpdateControlMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Control) =>
      apiClient.put<Control>(`/api/controls/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['controls'])
      },
    }
  )
}

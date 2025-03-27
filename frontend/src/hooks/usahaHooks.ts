import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Usaha } from '../types/Usaha'

export const useGetUsahasQuery = () =>
  useQuery({
    queryKey: ['usahas'],
    queryFn: async () => (await apiClient.get<Usaha[]>(`/api/usahas`)).data,
  })

export const useAddUsahaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (regak: Usaha) => apiClient.post<Usaha>(`/api/usahas`, regak),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['usahas'])
      },
    }
  )
}

export const useUpdateUsahaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Usaha) => apiClient.put<Usaha>(`/api/usahas/${murah._id}`, murah),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['usahas'])
      },
    }
  )
}

export const useDeleteUsahaMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (mahal: string) => apiClient.delete(`/api/usahas/${mahal}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['usahas'])
      },
    }
  )
}

// Pada bagian onSuccess, setelah permintaan berhasil (misalnya ketika server mengirimkan respons tanpa kesalahan), fungsi queryClient.invalidateQueries(['usahas']) akan dipanggil. Ini berarti setelah harga baru ditambahkan, data yang berkaitan dengan kunci query ['usahas'] akan dihapus dari cache.
// export const useAddUsahaMutation = () => {
//   const queryClient = useQueryClient()
//   return useMutation(
//     (regak: Usaha) => apiClient.post<Usaha>(`/api/usahas`, regak),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['usahas'])
//       },
//     }
//   )
// }

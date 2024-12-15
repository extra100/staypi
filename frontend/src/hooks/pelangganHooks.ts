import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import apiClient from '../apiClient'
import { Pelanggan } from '../types/Pelanggan'

export const useGetPelanggansQueryDb = () =>
  useQuery({
    queryKey: ['pelanggans'],
    queryFn: async () =>
      (await apiClient.get<Pelanggan[]>(`/api/pelanggans`)).data,
  })
// export const useGetPelanggansQueryGroupName = (
//   namaGroup: string = 'BAJA NTB'
// ) =>
//   useQuery({
//     queryKey: ['pelanggans', namaGroup],
//     queryFn: async () => {
//       console.log('Fetching data for namaGroup:', namaGroup) // Menambahkan log di sini
//       const response = await apiClient.get<Pelanggan[]>(`/api/pelanggans`, {
//         params: { namaGroup },
//       })
//       console.log('Response data:', response.data)
//       return response.data
//     },
//   })

export const useGetPelanggansQueryGroupName = (name?: string) =>
  useQuery({
    queryKey: ['pelanggans', name],
    queryFn: async () =>
      (
        await apiClient.get<Pelanggan[]>(`/api/pelanggans`, {
          params: { name },
        })
      ).data,
    keepPreviousData: true, // Agar data sebelumnya tetap ditampilkan saat memuat data baru
  })

export const useGetPelanggansQuery = () =>
  useQuery({
    queryKey: ['pelanggans'],
    queryFn: async () => {
      const response = await apiClient.get<{
        data: {
          id: number
          name: string
          group_id: number
          phone: string
          address: string
          group?: {
            id: number
            name: string
          }
        }[]
        meta: { total: number }
      }>('/api/pelanggans/pelanggans')

      return response.data.data as Pelanggan[]
    },
  })
export const useGetThenAddPelanggansQuery = (
  batchSize: number,
  offset: number
) =>
  useQuery({
    queryKey: ['pelanggans', batchSize, offset],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: {
            id: number
            name: string
            group_id: number
            phone: string
            address: string
            group?: {
              id: number
              name: string
            }
          }[]
          meta: { total: number }
        }>(`/api/pelanggans?limit=${batchSize}&offset=${offset}`)

        return response.data.data as Pelanggan[]
      } catch (error) {
        console.error('Error fetching pelanggans:', error)
        throw error
      }
    },
  })

export const useAddPelanggan = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (warehouse: Pelanggan) => {
      return apiClient.post<Pelanggan>(`/api/pelanggans`, warehouse)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pelanggans'])
      },
    }
  )
}
export const useUpdatePelangganMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (murah: Pelanggan) =>
      apiClient.put<Pelanggan>(`/api/pelanggans/${murah._id}`, murah), // gunakan _id
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pelanggans'])
      },
    }
  )
}

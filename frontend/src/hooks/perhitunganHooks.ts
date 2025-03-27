import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Perhitungan } from '../types/Perhitungan' // Pastikan Anda mendefinisikan tipe data yang sesuai

export const useGetPerhitunganQuery = () =>
  useQuery({
    queryKey: ['perhitungans'], // Kunci untuk query ini
    queryFn: async () => {
      const response = await apiClient.get<Perhitungan[]>('/api/perhitungans')
      return response.data
    },
  })

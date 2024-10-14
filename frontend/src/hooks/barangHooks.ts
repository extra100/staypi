import {
  QueryCache,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Barang } from '../types/Barang'

export const useGetBarangsQuery = () =>
  useQuery({
    queryKey: ['barangs'],
    queryFn: async () => (await apiClient.get<Barang[]>(`/api/barangs`)).data,
  })
export const useGetBarangByIdQuery = (name: any) =>
  useQuery<Barang[]>(
    ['contacts', name],
    async () => (await apiClient.get<Barang[]>(`/api/contacts/${name}`)).data
  )

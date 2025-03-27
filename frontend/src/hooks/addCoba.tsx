import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import api from '../pages/api/http'

export default function useGetDetail(idInv: number) {
  const { data: Detail, refetch } = useQuery<{ id: number; amount: number }[]>({
    queryKey: ['detail', idInv],
    queryFn: async () => {
      const response = await api.get(`/kledo/detail/${idInv}`)
      if (response.status === 200) {
        return response.data
      }
      return undefined
    },
    enabled: idInv !== 200 ? true : false,
  })
  useEffect(() => {
    if (idInv !== 0) {
      refetch
    }
  })
}

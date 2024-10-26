import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'

type BarangSoldData = {
  finance_account_id: number
  trans_date: string
  warehouse_id: number
  totalQty: number
  totalPersen: number
}

export const useFetchBarangSold = (
  startDate: string,
  endDate: string,
  warehouseId?: number,
  contactId?: any
) => {
  return useQuery<BarangSoldData[], Error>(
    ['barangSold', startDate, endDate, warehouseId, contactId],
    async () => {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ...(warehouseId ? { warehouse_id: warehouseId.toString() } : {}),
        ...(contactId ? { contact_id: contactId } : {}),
      })

      const response = await apiClient.get(
        `/api/sold-barang?${queryParams.toString()}`
      )
      return response.data
    },
    {
      enabled: !!startDate && !!endDate,
    }
  )
}

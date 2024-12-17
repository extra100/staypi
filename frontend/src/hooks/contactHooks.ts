import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Contact } from '../types/Contact'
import { QueryCache } from '@tanstack/react-query'

// export const useGetContactsQuery = () =>
//   useQuery({
//     queryKey: ['contacts'],
//     queryFn: async () => {
//       try {
//         const response = await apiClient.get<{
//           data: {
//             id: string
//             name: string
//             group_id: string
//             group_name: string
//           }[]
//         }>('/api/contacts/contacts')

//         // Tambahkan log ini untuk melihat isi response dari API
//         console.log('Response API:', response)

//         return response.data.data
//       } catch (error) {
//         console.error('Error fetching contacts:', error)
//         throw error
//       }
//     },
//   })

export const useGetContactsQuerysa = (contactId: any | null) =>
  useQuery({
    queryKey: ['pelanggans', contactId], // Tambahkan `date` dalam query key
    queryFn: async () => {
      if (!contactId) {
        console.log('No contactId or date provided')
        return []
      }

      console.log('Fetching pelanggans for contactId:', contactId) // Debug
      const response = await apiClient.get<Contact[]>(
        `/api/pelanggans?contactId=${Number(contactId)}`
      )
      console.log('Data from API:', response.data) // Debug data dari API
      return response.data
    },
    enabled: !!contactId, // Pastikan kedua nilai ada sebelum query dijalankan
  })

export const useGetContactsQuery = () =>
  useQuery({
    queryKey: ['contacts'],
    queryFn: async () => (await apiClient.get<Contact[]>(`/api/contacts`)).data,
  })
export const useGetPelangganByIdQuery = (name: any) =>
  useQuery<Contact[]>(
    ['contacts', name],
    async () => (await apiClient.get<Contact[]>(`/api/contacts/${name}`)).data
  )
export const useGetThenAddContactsQuery = (batchSize: number, offset: number) =>
  useQuery({
    queryKey: ['contacts', batchSize, offset],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          data: {
            id: string
            name: string
            group_id: string
            receivable: string
          }[]
        }>(`/api/contacts/contacts?limit=${batchSize}&offset=${offset}`)

        return response.data.data
      } catch (error) {
        console.error('Error fetching contacts:', error)
        throw error
      }
    },
  })

export const useAddContact = () => {
  const queryClient = useQueryClient()
  return useMutation(
    (warehouse: Contact) => {
      return apiClient.post<Contact>(`/api/contacts`, warehouse)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['contacts'])
      },
    }
  )
}

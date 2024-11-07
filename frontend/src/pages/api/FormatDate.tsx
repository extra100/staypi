import dayjs from 'dayjs'

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('DD-MM-YYYY')
}

import 'dayjs/locale/id'

dayjs.locale('id') // Mengatur lokal ke Bahasa Indonesia

export const formatDateBulan = (dateString: string): string => {
  return dayjs(dateString).format('D MMMM YYYY')
}

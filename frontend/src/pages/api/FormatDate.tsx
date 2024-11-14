import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id') // Mengatur lokal ke Bahasa Indonesia

export const formatDate = (dateString: any): string => {
  console.log('dateString:', dateString)

  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return 'Tanggal tidak valid'
  }
  return dayjs(dateString).format('DD-MM-YYYY')
}

export const formatDateBulan = (dateString: any): string => {
  console.log('dateString:', dateString)

  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return 'Tanggal tidak valid'
  }
  return dayjs(dateString).format('D MMMM YYYY')
}

import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from 'antd'
import { useGetFilteredTransaksisQuery } from './hooks/transactionHooks'
import { TakeInvoicesFromKledoBasedOnDate } from './pages/takeInvoiceFromKledoBasedOnDate'
import { useRedData } from './badgeMessage'
import { useGetWarehousesQuery } from './hooks/warehouseHooks'
import UserContext from './contexts/UserContext'

const BagdePenjualan: React.FC = () => {
  const { data: gudangdb } = useGetWarehousesQuery()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const today = new Date()
  const todayFormatted = formatDate(today)

  const [transDateFrom, setTransDateFrom] = useState<string | null>(
    todayFormatted
  )
  const [transDateTo, setTransDateTo] = useState<string | null>(todayFormatted)
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(
    idOutletLoggedIn
  )

  const { loading, getInvFromKledoBasedDate } =
    TakeInvoicesFromKledoBasedOnDate(
      transDateFrom,
      transDateTo,
      selectedWarehouse
    )

  const { data: filteredTransaksis, isLoading: loadingOwnDb } =
    useGetFilteredTransaksisQuery({
      transDateFrom,
      transDateTo,
      selectedWarehouse,
    })

  const { setHasRedData } = useRedData()

  const [hasRedData, setHasRedDataLocal] = useState(false)

  useEffect(() => {
    const combinedData = [
      ...(getInvFromKledoBasedDate?.map((row: any) => {
        const matchingRow = filteredTransaksis?.find(
          (transaksi) => transaksi.id === row.id
        )
        return {
          ...row,
          id_kledo: row.id,
          id_own_db: matchingRow?.id,
          isRed: !matchingRow,
        }
      }) ?? []),
      ...(filteredTransaksis
        ?.filter(
          (transaksi) =>
            !getInvFromKledoBasedDate?.some(
              (row: any) =>
                row.id === transaksi.id && transaksi.reason_id === 'unvoid'
            )
        )
        .map((transaksi: any) => ({
          ...transaksi,
          id_kledo: null,
          id_own_db: transaksi.id,
          isRed: true,
        })) ?? []),
    ]

    const hasRedData = combinedData.some((data) => data.isRed)

    setHasRedDataLocal(hasRedData)
    setHasRedData(hasRedData)
  }, [getInvFromKledoBasedDate, filteredTransaksis, setHasRedData])

  return (
    <div>
      <Link to={`/getinvbasedondate`}>
        {hasRedData && (
          <Badge
            count="Pesan"
            style={{
              backgroundColor: 'red',
              color: 'white',
              fontSize: '0.8rem',
              marginLeft: '5px',
            }}
          />
        )}
      </Link>
    </div>
  )
}

export default BagdePenjualan

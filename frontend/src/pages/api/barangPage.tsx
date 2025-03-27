import React from 'react'
import { useGetBarangsQuery } from '../../hooks/barangHooks'

const BarangList = () => {
  const perPage = 15
  const { data, isLoading, error } = useGetBarangsQuery()
  console.log({ data })
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error fetching data</div>
  }

  return (
    <div>
      <h1>List of Barangs</h1>
      <ul>
        {data?.map((barang: any) => (
          <li key={barang.id}>
            {barang.name} - Rp{barang.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BarangList

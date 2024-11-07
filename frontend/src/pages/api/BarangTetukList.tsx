import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'

import { Barang } from '../../types/Barang'
import {
  useAddBarang,
  useGetThenAddBarangsQuery,
} from '../../hooks/barangTetukHooks'

const BarangTetuk = () => {
  const [offset, setOffset] = useState(0)
  const batchSize = 10
  const [isProcessing, setIsProcessing] = useState(false)
  const [allBarangs, setAllBarangs] = useState<Barang[]>([])
  const [Barangset, setBarangset] = useState(new Set())

  const {
    data: Barangs,
    refetch,
    isLoading,
  } = useGetThenAddBarangsQuery(batchSize, offset)
  const addBarangMutation = useAddBarang()
  console.log({ Barangs })
  useEffect(() => {
    if (!Barangs || Barangs.length === 0) return

    const newBarangs = Barangs.filter((barang) => !Barangset.has(barang.id))
    setBarangset((prevSet) => {
      const updatedSet = new Set(prevSet)
      newBarangs.forEach((barang) => updatedSet.add(barang.id))
      return updatedSet
    })

    setAllBarangs((prevBarangs) => [...prevBarangs, ...(newBarangs as any)])

    if (Barangs.length === batchSize) {
      setTimeout(() => setOffset((prevOffset) => prevOffset + batchSize), 500)
    }
  }, [Barangs])

  useEffect(() => {
    if (offset > 0) {
      refetch()
    }
  }, [offset])

  const handleSave = async () => {
    setIsProcessing(true)

    for (let i = 0; i < allBarangs.length; i += batchSize) {
      const batch = allBarangs.slice(i, i + batchSize)

      for (const barang of batch) {
        try {
          await addBarangMutation.mutateAsync(barang)
          console.log(`Successfully added barang: ${barang.name}`)
        } catch (error) {
          console.error(`Failed to add barang: ${barang.name}`, error)
        }
      }
    }

    setIsProcessing(false)
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Unit ID',
      dataIndex: ['unit', 'id'], // menggunakan array untuk nested field
      key: 'unit.id',
    },
    {
      title: 'Nama Unit',
      dataIndex: ['unit', 'name'], // menggunakan array untuk nested field
      key: 'unit.name',
    },
  ]

  return (
    <div>
      <h1>Barang List</h1>
      {isLoading ? (
        <Spin tip="Loading Barangs..." />
      ) : (
        <Table
          dataSource={Barangs}
          columns={columns}
          rowKey="id"
          // pagination={true}
        />
      )}

      <Button
        type="primary"
        onClick={handleSave}
        disabled={isProcessing || isLoading}
        loading={isProcessing}
        style={{ marginTop: 16 }}
      >
        {isProcessing ? 'Saving...' : 'Save All Barangs'}
      </Button>
    </div>
  )
}

export default BarangTetuk

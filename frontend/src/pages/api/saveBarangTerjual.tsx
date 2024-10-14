import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'
import { Barter } from '../../types/BarangTerjual'
import {
  useAddBarter,
  useGetBartersQuery,
  useGetThenAddBartersQuery,
} from '../../hooks/barangTerjualHooks'

const BatchProcessBarters = () => {
  const [offset, setOffset] = useState(0)
  const batchSize = 10
  const [isProcessing, setIsProcessing] = useState(false)
  const [allBarters, setAllBarters] = useState<Barter[]>([])
  const [barterSet, setBarterSet] = useState(new Set())

  const {
    data: barters,
    refetch,
    isLoading,
  } = useGetThenAddBartersQuery(batchSize, offset)
  const barterjual = useGetBartersQuery()
  const addBarterMutation = useAddBarter()
  console.log({ barters })
  useEffect(() => {
    if (!barters || barters.length === 0) return

    const newBarters = barters.filter((barter) => !barterSet.has(barter.id))
    setBarterSet((prevSet) => {
      const updatedSet = new Set(prevSet)
      newBarters.forEach((barter) => updatedSet.add(barter.id))
      return updatedSet
    })

    // setAllBarters((prevBarters) => [...prevBarters, ...newBarters])

    if (barters.length === batchSize) {
      setTimeout(() => setOffset((prevOffset) => prevOffset + batchSize), 500)
    }
  }, [barters])

  useEffect(() => {
    if (offset > 0) {
      refetch()
    }
  }, [offset])

  const handleSave = async () => {
    setIsProcessing(true)

    for (let i = 0; i < allBarters.length; i += batchSize) {
      const batch = allBarters.slice(i, i + batchSize)

      for (const barter of batch) {
        try {
          await addBarterMutation.mutateAsync(barter)
          //   console.log(`Successfully added barter: ${barter.trans_date}`)
        } catch (error) {
          //   console.error(`Failed to add barter: ${barter.trans_date}`, error)
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
      title: 'INV',
      dataIndex: 'ref_number',
      key: 'ref_number',
    },
    {
      title: 'Outlet',
      dataIndex: 'warehouse_id',
      key: 'warehouse_id',
    },
    {
      title: 'Tanggal Trans',
      dataIndex: 'trans_date',
      key: 'trans_date',
    },
    {
      title: 'Tempo',
      dataIndex: 'due_date',
      key: 'due_date',
    },
    {
      title: 'hutang',
      dataIndex: 'due',
      key: 'due',
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Pelanggan',
      dataIndex: 'contact_id',
      key: 'contact_id',
    },
  ]

  return (
    <div>
      <h1>Barter List</h1>
      {isLoading ? (
        <Spin tip="Loading barters..." />
      ) : (
        <Table
          dataSource={allBarters}
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
        {isProcessing ? 'Saving...' : 'Save All Barters'}
      </Button>
    </div>
  )
}

export default BatchProcessBarters

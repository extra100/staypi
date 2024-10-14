import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'

import { AkunBank } from '../../types/AkunBank'
import {
  useAddAkunBank,
  useGetThenAddAkunBanksQuery,
} from '../../hooks/akunBankHooks'

const BatchProcessAkunBanks = () => {
  const [offset, setOffset] = useState(0)
  const batchSize = 10
  const [isProcessing, setIsProcessing] = useState(false)
  const [allAkunBanks, setAllAkunBanks] = useState<AkunBank[]>([])
  const [akunBankSet, setAkunBankSet] = useState(new Set())

  const {
    data: akunBanks,
    refetch,
    isLoading,
  } = useGetThenAddAkunBanksQuery(batchSize, offset)
  const addAkunBankMutation = useAddAkunBank()

  useEffect(() => {
    if (!akunBanks || akunBanks.length === 0) return

    const newAkunBanks = akunBanks.filter(
      (akunBank) => !akunBankSet.has(akunBank.id)
    )
    setAkunBankSet((prevSet) => {
      const updatedSet = new Set(prevSet)
      newAkunBanks.forEach((akunBank) => updatedSet.add(akunBank.id))
      return updatedSet
    })

    setAllAkunBanks((prevAkunBanks) => [...prevAkunBanks, ...newAkunBanks])

    if (akunBanks.length === batchSize) {
      setTimeout(() => setOffset((prevOffset) => prevOffset + batchSize), 500)
    }
  }, [akunBanks])

  useEffect(() => {
    if (offset > 0) {
      refetch()
    }
  }, [offset])

  const handleSave = async () => {
    setIsProcessing(true)

    for (let i = 0; i < allAkunBanks.length; i += batchSize) {
      const batch = allAkunBanks.slice(i, i + batchSize)

      for (const akunBank of batch) {
        try {
          await addAkunBankMutation.mutateAsync(akunBank)
          console.log(`Successfully added akunBank: ${akunBank.name}`)
        } catch (error) {
          console.error(`Failed to add akunBank: ${akunBank.name}`, error)
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
  ]

  return (
    <div>
      <h1>AkunBank List</h1>
      {isLoading ? (
        <Spin tip="Loading akunBanks..." />
      ) : (
        <Table
          dataSource={allAkunBanks}
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
        {isProcessing ? 'Saving...' : 'Save All AkunBanks'}
      </Button>
    </div>
  )
}

export default BatchProcessAkunBanks

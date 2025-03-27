import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'
import { useAddTag, useGetThenAddTagsQuery } from '../../hooks/tagHooks'
import { Tag } from '../../types/Tag'

const BatchProcessTags = () => {
  const [offset, setOffset] = useState(0)
  const batchSize = 10
  const [isProcessing, setIsProcessing] = useState(false)
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [tagSet, setTagSet] = useState(new Set())

  const {
    data: tags,
    refetch,
    isLoading,
  } = useGetThenAddTagsQuery(batchSize, offset)
  const addTagMutation = useAddTag()

  useEffect(() => {
    if (!tags || tags.length === 0) return

    const newTags = tags.filter((tag) => !tagSet.has(tag.id))
    setTagSet((prevSet) => {
      const updatedSet = new Set(prevSet)
      newTags.forEach((tag) => updatedSet.add(tag.id))
      return updatedSet
    })

    setAllTags((prevTags) => [...prevTags, ...newTags])

    if (tags.length === batchSize) {
      setTimeout(() => setOffset((prevOffset) => prevOffset + batchSize), 500)
    }
  }, [tags])

  useEffect(() => {
    if (offset > 0) {
      refetch()
    }
  }, [offset])

  const handleSave = async () => {
    setIsProcessing(true)

    for (let i = 0; i < allTags.length; i += batchSize) {
      const batch = allTags.slice(i, i + batchSize)

      for (const tag of batch) {
        try {
          await addTagMutation.mutateAsync(tag)
          console.log(`Successfully added tag: ${tag.name}`)
        } catch (error) {
          console.error(`Failed to add tag: ${tag.name}`, error)
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
      <h1>Tag List</h1>
      {isLoading ? (
        <Spin tip="Loading tags..." />
      ) : (
        <Table
          dataSource={allTags}
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
        {isProcessing ? 'Saving...' : 'Save All Tags'}
      </Button>
    </div>
  )
}

export default BatchProcessTags

import React, { useState, useEffect } from 'react'
import { Input, Spin, Table, Typography, Modal, Button, message } from 'antd'
import { searchBasedNamaBarang } from './SearchBasedNamaBarang'
import { useAddBarangMutation } from '../../hooks/barangHooks'
import { useGetBarangsQuery } from '../../hooks/barangHooks'
import { Barang } from '../../types/Barang'

const { Title } = Typography

const BarangSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const { loading, namaBarang } = searchBasedNamaBarang(debouncedSearchTerm)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null)
  const { mutateAsync: addBarang, isLoading: isAdding } = useAddBarangMutation()

  const { data: barangs } = useGetBarangsQuery()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) 

    return () => clearTimeout(timer) 
  }, [searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleRowClick = (record: Barang) => {
    setSelectedBarang(record)
    setIsModalVisible(true)
  }

  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedBarang(null)
  }

  const handleSaveBarang = async () => {
    if (selectedBarang) {

      const isDuplicate = barangs?.some(
        (barang: Barang) => barang.id === selectedBarang.id
      )

      if (isDuplicate) {
        message.warning('Barang sudah ada di database!')
        return
      }

      try {
        await addBarang(selectedBarang)
        setIsModalVisible(false)
        setSelectedBarang(null)
        message.success('Barang berhasil disimpan!')
      } catch (error) {
        console.error('Error saving barang:', error)
        message.error('Gagal menyimpan barang!')
      }
    }
  }


  const columns = [
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
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `Rp ${price.toLocaleString()}`,
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'name'],
      key: 'unit',
    },
    {
      title: 'Category ID',
      dataIndex: 'pos_product_category_id',
      key: 'pos_product_category_id',
    },
  ]

  return (
    <div>
      <Title level={2}>Search Barang</Title>
      <Input
        placeholder="Search for a barang"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: 300, marginBottom: 20 }}
      />
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={namaBarang}
          columns={columns}
          rowKey="_id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record as any),
          })}
        />
      )}

      <Modal
        title="Detail Barang"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedBarang && (
          <div>
            <p>
              <strong>ID:</strong> {selectedBarang.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedBarang.name}
            </p>
            <p>
              <strong>Code:</strong> {selectedBarang.code}
            </p>
            <p>
              <strong>Price:</strong> Rp {selectedBarang.price.toLocaleString()}
            </p>
            <p>
              <strong>Unit:</strong> {selectedBarang.unit?.name || 'N/A'}
            </p>
            <p>
              <strong>Category ID:</strong>{' '}
              {selectedBarang.pos_product_category_id}
            </p>
            <Button
              type="primary"
              onClick={handleSaveBarang}
              loading={isAdding}
              style={{ marginTop: 20 }}
            >
              Simpan Barang Baru
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default BarangSearchPage

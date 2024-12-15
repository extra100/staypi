import React, { useContext, useState } from 'react'
import { Table, Input, Select, Modal, Form, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useUpdateBarangMutation } from '../../hooks/barangHooks'
import {
  useGetPelanggansQueryDb,
  useUpdatePelangganMutation,
} from '../../hooks/pelangganHooks'
import { useGetWarehousesQuery } from '../../hooks/warehouseHooks'
import UserContext from '../../contexts/UserContext'

const { Option } = Select

const PelangganTable: React.FC = () => {
  const { data: gudangs } = useGetWarehousesQuery()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  let isAdmin = false

  if (user) {
    idOutletLoggedIn = user.id_outlet
    isAdmin = user.isAdmin
  }

  const outletName =
    (Array.isArray(gudangs) &&
      gudangs.find((user) => String(user.id) === idOutletLoggedIn)?.name) ||
    'Outlet Tidak Diketahui'
  console.log({ outletName })
  const { data: pelanggans } = useGetPelanggansQueryDb()
  const updatePelanggan = useUpdatePelangganMutation()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterById, setFilterById] = useState<string | null>(null)
  const [editingPelanggan, setEditingPelanggan] = useState<any | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleFilterById = (value: number) => {
    setFilterById(value as any)
  }

  const handleEditClick = (record: any) => {
    setEditingPelanggan(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields()
      await updatePelanggan.mutateAsync({ ...editingPelanggan, ...values })
      setIsModalVisible(false)
      setEditingPelanggan(null)
    } catch (error) {
      console.error('Failed to save changes:', error)
    }
  }

  const filteredPelanggan = Array.isArray(pelanggans)
    ? isAdmin
      ? pelanggans
      : pelanggans.filter((pelanggan) => pelanggan.group?.name === outletName)
    : []

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nama Pelanggan',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Id Group',
      dataIndex: 'group_id',
      key: 'group_id',
    },

    {
      title: 'Nama Group',
      dataIndex: ['group', 'name'],
      key: 'group',
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Kontak',
      dataIndex: 'phone',
      key: 'phone',
    },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>Daftar Barang</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          allowClear
          showSearch
          placeholder="Pilih ID pelanggan"
          style={{ width: '70%' }}
          optionFilterProp="label"
          filterOption={(input: any, option: any) =>
            option?.label
              ?.toString()
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          onChange={handleFilterById}
        >
          {pelanggans &&
            pelanggans.map((pelanggan: any) => (
              <Option
                key={pelanggan.id}
                value={pelanggan.id.toString()}
                label={`${pelanggan.id} - ${pelanggan.name}`}
              >
                {pelanggan.id} - {pelanggan.name} - {pelanggan.price}
              </Option>
            ))}
        </Select>
        <Button type="primary" onClick={() => navigate('/tambahpelanggan')}>
          TAMBAH PELANGGAN
        </Button>
      </div>
      <Table
        dataSource={filteredPelanggan}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        onRow={(record) => ({
          onClick: () => handleEditClick(record),
        })}
      />
      <Modal
        title="Edit Pelanggan"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveChanges}>
            Simpan
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label="ID"
            rules={[{ required: true, message: 'ID harus diisi' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nama Pelanggan"
            rules={[{ required: true, message: 'Nama pelanggan harus diisi' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group_id"
            label="ID Group"
            rules={[{ required: true, message: 'ID group harus diisi' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name={['group', 'name']}
            label="Nama Group"
            rules={[{ required: true, message: 'Nama group harus diisi' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="address"
            label="Alamat"
            rules={[{ required: true, message: 'Alamat harus diisi' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Kontak"
            rules={[{ required: true, message: 'Kontak harus diisi' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default PelangganTable

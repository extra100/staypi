import React, { useContext, useState } from 'react'
import { Table, Input, Select, Modal, Form, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useGetPelanggansQueryDb } from '../../hooks/pelangganHooks'

import {
  useGetWarehousesQuery,
  useUpdateWarehouseMutations,
} from '../../hooks/warehouseHooks'
import UserContext from '../../contexts/UserContext'

const { Option } = Select

const TableWarehouse: React.FC = () => {
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
  // const { data: outlets } = useGetPelanggansQueryDb()
  const navigate = useNavigate()
  const updateOutlet = useUpdateWarehouseMutations()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterById, setFilterById] = useState<string | null>(null)
  const [editOultet, setEditOitlet] = useState<any | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleFilterById = (value: number) => {
    setFilterById(value as any)
  }

  const handleEditClick = (record: any) => {
    setEditOitlet(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields()
      await updateOutlet.mutateAsync({ ...editOultet, ...values })
      setIsModalVisible(false)
      setEditOitlet(null)
    } catch (error) {
      console.error('Failed to save changes:', error)
    }
  }

  // const filteredWarehouse = Array.isArray(gudangs)
  //   ? isAdmin
  //     ? gudangs
  //     : gudangs.filter((warehouse) => warehouse.group?.name === outletName)
  //   : []

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nama Outlet',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Kontak',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Alamat',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
    },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>Daftar Outlet</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          allowClear
          showSearch
          placeholder="Pilih ID warehouse"
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
          {gudangs &&
            gudangs.map((warehouse: any) => (
              <Option
                key={warehouse.id}
                value={warehouse.id.toString()}
                label={`${warehouse.id} - ${warehouse.name}`}
              >
                {warehouse.id} - {warehouse.name} - {warehouse.price}
              </Option>
            ))}
        </Select>
        {/* <Button type="primary" onClick={() => navigate('/tambahpelanggan')}>
          TAMBAH PELANGGAN
        </Button> */}
      </div>
      <Table
        dataSource={gudangs}
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
        style={{ width: '1400px' }}
        title="Edit Outlet"
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
            label="ID Outlet"
            rules={[{ required: true, message: 'ID harus diisi' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nama Outlet"
            rules={[{ required: true, message: 'Nama warehouse harus diisi' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Code harus diisi' }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 6 }} // Menentukan tinggi minimum dan maksimum
              placeholder="Masukkan code"
            />
          </Form.Item>

          <Form.Item
            name="contact"
            label="contact"
            rules={[{ required: true, message: 'Kontak harus diisi' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="platform"
            label="platform"
            rules={[{ required: true, message: 'Platform harus diisi' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TableWarehouse

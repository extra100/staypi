import React, { useState, useEffect } from 'react'
import { Select, Row, Col, Table, Input } from 'antd'
import { useIdContact } from './NamaContact'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

const FilteredContact: React.FC = () => {
  const navigate = useNavigate()
  const { idContact } = useIdContact()
  const [selectedContactGroup, setSelectedContactGroup] = useState<
    string | null
  >(null)
  const [filteredContacts, setFilteredContacts] = useState<any[]>([])
  const [searchName, setSearchName] = useState<string>('')

  const handleContactChange = (value: string) => {
    setSelectedContactGroup(value)
  }

  useEffect(() => {
    let contacts = idContact
    if (selectedContactGroup) {
      contacts = contacts.filter(
        (contact: any) =>
          contact.group_name === selectedContactGroup &&
          parseFloat(contact.receivable) !== 0
      )
    }

    if (searchName) {
      contacts = contacts.filter((contact: any) =>
        contact.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }

    setFilteredContacts(contacts)
  }, [selectedContactGroup, idContact, searchName])

  const columns = [
    {
      title: 'Nama Pelanggan',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Grup Pelanggan',
      dataIndex: 'group_name',
      key: 'group_name',
      render: (group_name: string) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() =>
            navigate(`/detailpiutangperkontak?group_name=${group_name}`)
          }
        >
          {group_name}
        </span>
      ),
    },
    {
      title: 'Piutang',
      dataIndex: 'receivable',
      key: 'receivable',
      render: (receivable: number) => (
        <div style={{ textAlign: 'right' }}>
          {`Rp ${Math.round(receivable)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}
        </div>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '10px' }}>
        <Col span={12}>
          <Select
            showSearch
            placeholder="Pilih Kontak Group"
            style={{ width: '70%' }}
            optionFilterProp="label"
            filterOption={(input: any, option: any) =>
              option?.label
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            value={selectedContactGroup}
            onChange={handleContactChange}
          >
            {Array.isArray(idContact) &&
              [
                ...new Map(
                  idContact.map((item) => [item.group_name, item])
                ).values(),
              ].map((item) => (
                <Option
                  key={item.group_name}
                  value={item.group_name}
                  label={item.group_name}
                >
                  {item.group_name}
                </Option>
              ))}
          </Select>
        </Col>
        <Col span={12}>
          <Input
            placeholder="Cari Nama Pelanggan"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      <Table
        dataSource={filteredContacts.map((contact) => ({
          key: contact.id,
          id: contact.id,
          name: contact.name,
          group_name: contact.group_name,
          receivable: contact.receivable,
        }))}
        columns={columns}
        rowKey="id"
        summary={(pageData) => {
          let totalAmount = 0

          pageData.forEach(({ receivable: amount }) => {
            totalAmount += Number(amount)
          })

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <div style={{ textAlign: 'left' }}>
                  <strong>Total</strong>
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={0} colSpan={2}>
                <div style={{ textAlign: 'right' }}>
                  <strong>{`Rp ${totalAmount.toLocaleString()}`}</strong>
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </div>
  )
}

export default FilteredContact

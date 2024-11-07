import React, { useState, useEffect } from 'react'
import { Select, Row, Col, Table } from 'antd'
import { useIdContact } from './NamaContact'
import { useNavigate } from 'react-router-dom'

const { Option } = Select

const FilteredContact: React.FC = () => {
  const navigate = useNavigate()

  const { idContact } = useIdContact()
  console.log({ idContact })
  const [selectedContactGroup, setSelectedContactGroup] = useState<
    string | null
  >(null)
  const [filteredContacts, setFilteredContacts] = useState<any[]>([])

  const handleContactChange = (value: string) => {
    setSelectedContactGroup(value)
  }

  useEffect(() => {
    if (selectedContactGroup) {
      const contacts = idContact.filter(
        (contact: any) =>
          contact.group_name === selectedContactGroup &&
          parseFloat(contact.receivable) !== 0
      )

      setFilteredContacts(contacts)
    } else {
      setFilteredContacts([])
    }
  }, [selectedContactGroup, idContact])

  const columns = [
    {
      title: 'Id pelanggan',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: 'Nama Pelanggan',
      dataIndex: 'group_name', // Accesses nested group_id inside contact
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
          {`Rp ${receivable.toLocaleString()}`}
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

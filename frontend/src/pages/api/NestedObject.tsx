import React, { useState } from 'react'
import { Select, Card } from 'antd'

const { Option } = Select

interface Address {
  street: string
  city: string
  zip: string
}

interface UserData {
  id: string
  name: string
  email: string
  address: Address
}

const data: UserData[] = [
  {
    id: '12345',
    name: 'John Doe',
    email: 'johndoe@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      zip: '12345',
    },
  },
  {
    id: '67890',
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    address: {
      street: '456 Elm St',
      city: 'Othertown',
      zip: '67890',
    },
  },
]

const NestedObjectooo: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedData, setSelectedData] = useState<UserData | null>(null)

  const handleChange = (value: string) => {
    setSelectedId(value)
    const foundData = data.find((item) => item.id === value) || null
    setSelectedData(foundData)
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>Select an ID</h1>
      <Select
        placeholder="Select an ID"
        style={{ width: 200 }}
        onChange={handleChange}
        value={selectedId}
      >
        {data.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.id}
          </Option>
        ))}
      </Select>

      {selectedData && (
        <Card style={{ marginTop: '20px' }}>
          <p>
            <strong>Name:</strong> {selectedData.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedData.email}
          </p>
          <p>
            <strong>Address:</strong>
          </p>
          <p style={{ marginLeft: '20px' }}>
            <strong>Street:</strong> {selectedData.address.street}
            <br />
            <strong>City:</strong> {selectedData.address.city}
            <br />
            <strong>Zip:</strong> {selectedData.address.zip}
          </p>
        </Card>
      )}
    </div>
  )
}

export default NestedObjectooo

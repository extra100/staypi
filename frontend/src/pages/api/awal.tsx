import React, { useState } from 'react'
import { Select, Card } from 'antd'

const { Option } = Select

interface UserData {
  id: number
  name: string
  email: string
}

const data: UserData[] = [
  {
    id: 12345,
    name: 'John Doe',
    email: 'johndoe@example.com',
  },
  {
    id: 67890,
    name: 'Jane Smith',
    email: 'janesmith@example.com',
  },
]

const SelectIdForm: React.FC = () => {
  const [selectedId, setSelectedId] = useState<Number | null>(null)
  const [selectedData, setSelectedData] = useState<UserData | null>(null)

  const handleChange = (value: Number) => {
    setSelectedId(value)
    const foundData = data.find((item) => item.id === Number(value)) || null
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
            {item.name}
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
        </Card>
      )}
    </div>
  )
}

export default SelectIdForm

import React from 'react'
import { Table } from 'antd'

interface MyTablePageProps {
  showTable: boolean
}

const MyTablePage: React.FC<MyTablePageProps> = ({ showTable }) => {
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  ]

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Table Page</h2>
      {/* Tampilkan tabel hanya jika showTable bernilai true */}
      {showTable && <Table columns={columns} dataSource={data} />}
    </div>
  )
}

export default MyTablePage

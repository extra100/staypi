import React, { useState } from 'react'
import { Button } from 'antd'
import MyTablePage from './MyTablePage'

const ControlPage: React.FC = () => {
  // Menyimpan status untuk toggle visibilitas tabel
  const [showTable, setShowTable] = useState(true)

  // Fungsi untuk toggle visibilitas tabel
  const toggleTableVisibility = () => {
    setShowTable((prev) => !prev)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Control Page</h2>
      <Button onClick={toggleTableVisibility} type="primary">
        Toggle Table Visibility
      </Button>

      {/* Kirimkan showTable ke MyTablePage sebagai prop */}
      <MyTablePage showTable={showTable} />
    </div>
  )
}

export default ControlPage

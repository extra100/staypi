import React from 'react'
import { Form, Input, InputNumber, Select } from 'antd'
import { Outlet } from '../../types/Outlet'

interface CellOutletProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: keyof Outlet
  title: any
  inputType: 'number' | 'text' | 'select'
  record: Outlet
  index: number
  children: React.ReactNode
}

const CellOutlet: React.FC<CellOutletProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,

  ...restProps
}) => {
  let inputNode: React.ReactNode

  if (inputType === 'select') {
    inputNode = (
      <Form.Item
        name={dataIndex}
        initialValue={record[dataIndex]}
        rules={[
          {
            required: true,
            message: `Please Input ${title}!`,
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children
              ? option.children
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              : false
          }
        ></Select>
      </Form.Item>
    )
  } else if (inputType === 'number') {
    inputNode = <InputNumber />
  } else {
    inputNode = <Input />
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export default CellOutlet

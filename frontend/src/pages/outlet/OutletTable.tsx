import React from 'react'
import { Form, Popconfirm, Select, Table, Typography } from 'antd'
import { Outlet } from '../../types/Outlet'
import EditableCell from './CellOutlet'
import {
  AiOutlineArrowLeft,
  AiOutlineLike,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai'

interface OutletTableProps {
  form2hereOneAtPage: any
  asal: Outlet[]

  isLoading: boolean
  editingKey: string
  isEditing: (record: Outlet) => boolean
  save: (kunci: string) => void
  cancel: () => void
  edit: (record: Outlet) => void
  handleDelete: (kunci: string) => void

  showIdH: boolean
  showA: boolean
}

const OutletTable: React.FC<OutletTableProps> = ({
  form2hereOneAtPage,
  asal,

  isLoading,
  editingKey,
  isEditing,
  save,
  cancel,
  edit,
  handleDelete,

  showIdH,
  showA,
}) => {
  const columns = [
    {
      title: 'No',
      kunci: 'index',
      align: 'center' as 'center',
      fixed: true,
      width: '5%',
      render: (_: any, __: any, index: number) => index + 1,
    },

    ...(showIdH
      ? [
          {
            title: 'ID',
            dataIndex: 'id_outlet',

            fixed: true,
            editable: false,
            align: 'center' as 'center',
            render: (huruf: string) => (
              <div style={{ textAlign: 'center' }}>{huruf}</div>
            ),
            onCell: (record: Outlet) => ({
              record,
              inputType: 'text',
              dataIndex: 'id_outlet',
              title: 'ID',
              editing: isEditing(record),
            }),
          },
        ]
      : []),
    {
      title: 'Nama Outlet',
      dataIndex: 'nama_outlet',

      fixed: true,
      align: 'center' as 'center',

      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },

    ...(showA
      ? [
          {
            title: 'branch',
            dataIndex: 'bm',
            align: 'center' as 'center',
            fixed: true,

            render: (abjad: string) => (
              <div style={{ textAlign: 'center' }}>{abjad}</div>
            ),
            editable: true,
          },
        ]
      : []),
    {
      title: 'Lokasi',
      dataIndex: 'lokasi',

      fixed: true,
      align: 'center' as 'center',

      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },
    {
      title: 'cp',
      dataIndex: 'cp',

      fixed: true,
      align: 'center' as 'center',

      render: (naskah: string) => (
        <div style={{ textAlign: 'center' }}>{naskah}</div>
      ),
      editable: true,
    },

    {
      title: 'Aksi',
      dataIndex: 'operation',
      editable: false,
      fixed: true,
      align: 'center' as 'center',

      render: (_: any, record: Outlet) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Popconfirm
              title="Apakah Anda yakin ingin menyimpan perubahan ini?"
              onConfirm={() => save(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Typography.Link style={{ marginRight: 10 }}>
                <AiOutlineLike />
              </Typography.Link>
            </Popconfirm>

            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>
                <AiOutlineArrowLeft /> Batal
              </a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              onClick={() => edit(record)}
              style={{
                background: 'none',
                color: 'black',
                border: 'none',
                paddingInline: 'none',
                margin: '15px',
              }}
            >
              <AiOutlineEdit />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <a style={{ marginLeft: 8 }}>
                <AiOutlineDelete />
              </a>
            </Popconfirm>
          </span>
        )
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record: Outlet) => ({
        record,
        inputType:
          col.dataIndex === 'id_usaha'
            ? 'number'
            : col.dataIndex === 'id_outlet'
            ? 'select'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <Table
      className="table no-vertical-lines"
      components={{
        body: {
          cell: EditableCell,
        },
      }}
      dataSource={asal}
      columns={columns}
      rowClassName="editable-row"
      loading={isLoading}
      rowKey={(record) => record._id}
      expandable={{
        expandedRowRender: (record) => (
          <div>
            {/* <p style={{ margin: 0 }}>Id Supplier: {record.id_supplier} </p> */}
            <p style={{ margin: 0 }}>Id Usaha: {record.lokasi} </p>
            <p style={{ margin: 0 }}>Ket: {record.cp}</p>
          </div>
        ),
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <AiOutlineUp onClick={(e) => onExpand(record, e as any)} />
          ) : (
            <AiOutlineDown onClick={(e) => onExpand(record, e as any)} />
          ),
      }}
    />
  )
}
export default OutletTable

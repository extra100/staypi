import React, { useEffect, useState } from 'react'
import { Form } from 'antd'

import { Outlet } from '../../types/Outlet'
import { useNavigate } from 'react-router-dom'

import OutletTable from './OutletTable'
import ToggleOutlet from './ToggleOutlet'
import {
  useDeleteoutletMutation,
  useGetoutletsQuery,
  useUpdateoutletMutation,
} from '../../hooks/outletHooks'

const OutletPage: React.FC = () => {
  const navigate = useNavigate()
  //-----------------------toggle start--------------------------------------------------------------
  const [showIdH, setshowIdH] = useState(true)
  const [showA, setshowA] = useState(true)
  const toggleshowIdH = () => setshowIdH((prev) => !prev)
  const toggleshowA = () => setshowA((prev) => !prev)

  //-----------------------toggle end--------------------------------------------------------------

  const [bentuk] = Form.useForm()

  const { data, isLoading } = useGetoutletsQuery()
  const updateOutletMutation = useUpdateoutletMutation()
  const deleteOutletMutation = useDeleteoutletMutation()

  const [editingKey, setEditingKey] = useState('')

  const isEditing = (rekamHereOnly: Outlet) => rekamHereOnly._id === editingKey

  const edit = (justRecordHere: Outlet) => {
    bentuk.setFieldsValue({ ...justRecordHere })
    setEditingKey(justRecordHere._id)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (serek: string) => {
    try {
      const row = await bentuk.validateFields()
      await updateOutletMutation.mutateAsync({ ...row, _id: serek })
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleDelete = async (gembok: string) => {
    try {
      await deleteOutletMutation.mutateAsync(gembok)
    } catch (ellor) {
      console.log(ellor)
    }
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Outlet[]>(data || [])
  const handleSearch = (syarat: string) => {
    setSearchTerm(syarat)
  }
  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((kedoakm) =>
          Object.values(kedoakm).some((val) =>
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
    }
  }, [data, searchTerm])
  //-----------------------search start--------------------------------------------------------------

  return (
    <Form form={bentuk} component={false}>
      <ToggleOutlet
        onClick={() => navigate('/form-outlet')}
        buttonText=" + Outlet"
        showIdH={showIdH}
        showA={showA}
        toggleshowIdH={toggleshowIdH}
        toggleshowA={toggleshowA}
      />

      <OutletTable
        form2hereOneAtPage={bentuk}
        asal={filteredData}
        isLoading={isLoading}
        editingKey={editingKey}
        isEditing={isEditing}
        save={save}
        cancel={cancel}
        edit={edit}
        handleDelete={handleDelete}
        showIdH={showIdH}
        showA={showA}
      />
    </Form>
  )
}

export default OutletPage

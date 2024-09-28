import React, { useState, useEffect, useContext } from 'react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import UserContext from '../contexts/UserContext'

interface DateProsesPindahForm {
  onChange?: (startDate: string) => void
  defaultValue?: string[] | undefined | string
  value?: any

  // disabled: boolean
  // value: string
}

const DatePindahForm: React.FC<DateProsesPindahForm> = (props) => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''
  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(
    props.value ? dayjs(props.value) : currentDate
  )

  const handleStartDateChange = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setStartDate(date)
      if (props.onChange) {
        props.onChange(date.format('DD-MM-YYYY'))
      }
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, marginRight: '8px' }}>
        <DatePicker
          value={startDate as any}
          onChange={handleStartDateChange}
          style={{ width: '100%' }}
          disabled={!user?.isAdmin}
        />
      </div>

      <div style={{ flex: 1 }}></div>
    </div>
  )
}

export default DatePindahForm

import React, { useState, useEffect, useContext } from 'react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import UserContext from '../contexts/UserContext'

interface DateCicilan {
  value?: string
  onChange?: (startDate: string) => void
  defaultValue?: string[] | undefined | string
  disabled: boolean
  onClick?: () => void
}

const DateCicil: React.FC<DateCicilan> = (props) => {
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
        />
      </div>
    </div>
  )
}

export default DateCicil

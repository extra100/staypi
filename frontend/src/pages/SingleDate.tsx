import React, { useState, useEffect } from 'react'
import { Col, DatePicker, Row } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

interface SingleDateProps {
  value?: string
  onChange?: (date: string) => void
  onSave?: (startDate: string) => void
  defaultValue?: string | undefined
}

const SingleDate: React.FC<SingleDateProps> = (props) => {
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(
    props.value ? dayjs(props.value) : currentDate
  )

  useEffect(() => {
    if (props.onChange) {
      props.onChange(startDate.format('YYYY-MM-DD'))
    }
  }, [startDate, props])

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date)
    }
  }

  const labelStyle = {
    display: 'inline-block' as const,
    minWidth: '120px' as const,
    textAlign: 'left' as const,
  }

  const labelColonStyle = {
    display: 'inline-block' as const,
    minWidth: '10px' as const,
    textAlign: 'left' as const,
  }

  return (
    <div style={{ padding: '0px' }}>
      <Col span={12}>
        <span style={{ ...labelStyle, width: '30%' }}>Tgl. Transaksi</span>
        <span style={{ ...labelColonStyle, width: '5%' }}>:</span>
        <DatePicker
          style={{ width: '65%' }} // Adjust this width to fit the remaining Col width
          value={startDate}
          onChange={handleStartDateChange}
          format="YYYY-MM-DD"
        />
      </Col>
    </div>
  )
}

export default SingleDate

import React, { useState, useEffect } from 'react'
import { Col, DatePicker, Row, Slider } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

interface DateRangeProps {
  value?: [string, string]
  difference?: number
  onChange?: (dates: [string, string]) => void
  onDifferenceChange?: (diff: number) => void
  onSave?: (startDate: string, endDate: string, selisih: number) => void
  defaultValue?: string[] | undefined
}

const DateRange: React.FC<DateRangeProps> = (props) => {
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(
    props.value ? dayjs(props.value[0]) : currentDate
  )

  const [endDate, setEndDate] = useState<Dayjs>(
    props.value ? dayjs(props.value[1]) : currentDate.add(0, 'days')
  )

  const [dateDifference, setDateDifference] = useState<number>(
    props.difference !== undefined ? props.difference : 0
  )

  useEffect(() => {
    if (props.difference !== undefined && props.difference !== dateDifference) {
      setDateDifference(props.difference)
    }
  }, [props.difference])

  useEffect(() => {
    if (props.onChange) {
      props.onChange([
        startDate.format('DD-MM-YYYY'),
        endDate.format('DD-MM-YYYY'),
      ])
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (props.onDifferenceChange) {
      props.onDifferenceChange(dateDifference)
    }
  }, [dateDifference])

  const handleStartDateChange = (
    date: Dayjs | null,
    dateString: string | string[]
  ) => {
    if (date) {
      setStartDate(date)
      const newDifference = endDate.diff(date, 'days')
      setDateDifference(newDifference)
    }
  }

  const handleTerminChange = (value: number) => {
    const newEndDate = startDate.add(value, 'days')
    setEndDate(newEndDate)
    setDateDifference(value)

    if (props.onDifferenceChange) {
      props.onDifferenceChange(value)
    }
  }

  const marks = {
    0: <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COD</strong>,
    10: <strong>10</strong>,
    14: <strong>14</strong>,
    30: <strong>30</strong>,
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

  const sliderWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '70%',
  }

  return (
    <div style={{ padding: '0px' }}>
      <Row gutter={16} style={{ marginBottom: '10px' }}>
        <Col span={12}>
          <span style={labelStyle}>Tgl. Transaksi</span>
          <span style={labelColonStyle}>:</span>
          <DatePicker
            style={{ width: '70%' }}
            value={startDate as any}
            onChange={handleStartDateChange}
          />
        </Col>
        {/* <Col span={12}>
          <span style={labelStyle}>Tgl. Jatuh Tempo</span>
          <span style={labelColonStyle}>:</span>
          <DatePicker
            style={{ width: '70%' }}
            value={endDate as any}
            onChange={(date) => setEndDate(date!)}
          />
        </Col> */}
        <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={labelStyle}>Termin (Hari)</span>
          <span style={labelColonStyle}>: </span>
          <div style={sliderWrapperStyle}>
            <Slider
              marks={marks}
              step={null}
              defaultValue={dateDifference}
              value={dateDifference}
              onChange={handleTerminChange}
              min={0}
              max={30}
              style={{ width: '100%' }}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default DateRange

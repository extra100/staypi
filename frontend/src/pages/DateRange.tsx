import React, { useState, useEffect } from 'react'
import { DatePicker, Input } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker

interface DateRangeProps {
  value?: [string, string]
  difference?: number
  onChange?: (dates: [string, string]) => void
  onDifferenceChange?: (diff: number) => void
  onSave?: (startDate: string, endDate: string, selisih: number) => void

  defaultValue?: string[] | undefined // Tambahkan prop defaultValue
}

const DateRange: React.FC<DateRangeProps> = (props) => {
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(
    props.value ? dayjs(props.value[0]) : currentDate
  )

  const [endDate, setEndDate] = useState<Dayjs>(
    props.value ? dayjs(props.value[1]) : currentDate.add(30, 'days')
  )

  const [dateDifference, setDateDifference] = useState<number>(
    props.difference !== undefined ? props.difference : 30
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
  useEffect(() => {}, [startDate, endDate])

  useEffect(() => {
    if (props.onDifferenceChange) {
      props.onDifferenceChange(dateDifference)
    }
  }, [dateDifference])

  const handleStartDateChange = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setStartDate(date)
      const newDifference = endDate.diff(date, 'days')
      setDateDifference(newDifference)
    }
  }

  const handleEndDateChange = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setEndDate(date)
      const newDifference = date.diff(startDate, 'days')
      setDateDifference(newDifference)
    }
  }

  const handleDifferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const diffInput = e.target.value ? parseInt(e.target.value, 10) : 0

    if (!isNaN(diffInput)) {
      if (startDate && endDate) {
        const newEndDate = startDate.add(diffInput, 'days')
        setEndDate(newEndDate)
        setDateDifference(diffInput)
      }

      if (props.onDifferenceChange) {
        props.onDifferenceChange(diffInput)
      }
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <div style={{ marginBottom: '8px' }}>Tgl. Transaksi</div>
        <DatePicker
          value={startDate as any}
          onChange={handleStartDateChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ flex: 1, marginRight: '20px' }}>
        <div style={{ marginBottom: '8px' }}>Tgl. Jatuh Tempo</div>

        <DatePicker
          value={endDate as any}
          onChange={handleEndDateChange}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '8px' }}>Termin</div>

        <Input
          value={dateDifference !== null ? dateDifference.toString() : ''}
          onChange={handleDifferenceChange}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}

export default DateRange

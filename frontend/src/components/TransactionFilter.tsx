import React from 'react'

interface FilterProps {
  onFilter: (filters: Record<string, string | number>) => void
}

const TransactionFilter: React.FC<FilterProps> = ({ onFilter }) => {
  const [contactId, setContactId] = React.useState<string | number>('')
  const [statusId, setStatusId] = React.useState<string | number>('')
  const [startDate, setStartDate] = React.useState<string>('')
  const [endDate, setEndDate] = React.useState<string>('')

  const handleFilterChange = () => {
    onFilter({
      contactId,
      statusId,
      startDate,
      endDate,
    })
  }

  return (
    <div>
      <input
        type="number"
        value={contactId}
        onChange={(e) => setContactId(e.target.value)}
        placeholder="Contact ID"
      />
      <input
        type="number"
        value={statusId}
        onChange={(e) => setStatusId(e.target.value)}
        placeholder="Status ID"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
      />
      <button onClick={handleFilterChange}>Apply Filter</button>
    </div>
  )
}

export default TransactionFilter

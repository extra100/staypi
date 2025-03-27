import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5 // Jumlah halaman yang akan ditampilkan sebelum dan sesudah halaman saat ini
    const maxPages = 5 // Jumlah halaman yang ditampilkan di awal dan akhir

    let startPage = Math.max(1, currentPage - maxVisiblePages)
    let endPage = Math.min(totalPages, currentPage + maxVisiblePages)

    if (startPage > maxPages) {
      pageNumbers.push(
        <li key="first" onClick={() => onPageChange(1)}>
          First
        </li>
      )
    }

    if (currentPage > 1) {
      pageNumbers.push(
        <li key="prev" onClick={() => onPageChange(currentPage - 1)}>
          Prev
        </li>
      )
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => onPageChange(i)}
        >
          {i}
        </li>
      )
    }

    if (currentPage < totalPages) {
      pageNumbers.push(
        <li key="next" onClick={() => onPageChange(currentPage + 1)}>
          Next
        </li>
      )
    }

    if (endPage < totalPages - maxPages) {
      pageNumbers.push(
        <li key="last" onClick={() => onPageChange(totalPages)}>
          Last
        </li>
      )
    }

    return pageNumbers
  }

  return (
    <ul className="pagination">
      <li
        className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </li>
      {renderPageNumbers()}
      <li
        className={`pagination-item ${
          currentPage === totalPages ? 'disabled' : ''
        }`}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </li>
    </ul>
  )
}

export default Pagination

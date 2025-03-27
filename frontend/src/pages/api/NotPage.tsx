import React, { useRef } from 'react'
import { Button } from 'antd'
import Nota from './NotaKosong'

const NotaPage: React.FC = () => {
  const notaRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (notaRef.current) {
      const originalContent = document.body.innerHTML // Simpan konten asli
      document.body.innerHTML = notaRef.current.outerHTML // Tampilkan hanya bagian Nota
      window.print()
      document.body.innerHTML = originalContent // Kembalikan ke konten asli
      window.location.reload() // Segarkan halaman untuk memastikan script berjalan normal
    }
  }

  return (
    <div>
      <Button type="primary" onClick={handlePrint} style={{ marginBottom: 20 }}>
        Cetak Nota
      </Button>
      <Nota ref={notaRef} />
    </div>
  )
}

export default NotaPage

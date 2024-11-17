import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal, Button } from 'antd'

import { useIdMutation } from './takeSingleMutation'
import { updateDenganIdUnikMutasiDariKledo } from '../../hooks/pindahHooks'

const SimpanIdUnikDariMutasi: React.FC = () => {
  const { ref_number } = useParams<{ ref_number?: string }>()
  const navigate = useNavigate()

  const [timeExceeded, setTimeExceeded] = useState(false)

  const updateHanyaId = updateDenganIdUnikMutasiDariKledo()
  const { loading, getIdAtMutation } = useIdMutation(ref_number as string)

  const invoiceId = getIdAtMutation?.id ?? null
  useEffect(() => {
    console.log('State updated - invoiceId:', updateHanyaId)
  }, [updateHanyaId])
  // Log debugging
  console.log('Data dari useIdMutation:', getIdAtMutation)
  console.log('Invoice ID:', invoiceId)

  // Timer untuk memastikan modal muncul setelah waktu tertentu
  useEffect(() => {
    if (invoiceId) {
      const timer = setTimeout(() => {
        setTimeExceeded(true)
      }, 1000) // Set delay 1 detik

      return () => clearTimeout(timer)
    }
  }, [invoiceId])

  const handleButtonClick = async () => {
    if (ref_number && invoiceId) {
      try {
        const response = await updateHanyaId.mutateAsync({
          ref_number,
          id: invoiceId,
        })
        console.log('Invoice ID berhasil diperbarui:', response)
      } catch (error) {
        console.error('Gagal memperbarui Invoice ID:', error)
      }
    } else {
      console.warn('Data tidak lengkap:', { ref_number, invoiceId })
    }

    navigate(`/sudah-validasi/${ref_number}`)
  }

  return (
    <>
      {!loading && invoiceId && timeExceeded && (
        <Modal
          title="Mutasi Berhasil Dibuat, Klik Lanjutkan"
          footer={null}
          style={{ textAlign: 'center' }}
          bodyStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
          }}
          open={true}
        >
          <Button type="primary" onClick={handleButtonClick}>
            Lanjutkan Mutasi
          </Button>
        </Modal>
      )}
    </>
  )
}

export default SimpanIdUnikDariMutasi

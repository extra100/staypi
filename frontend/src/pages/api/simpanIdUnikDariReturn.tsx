import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal, Button } from 'antd'

import { useIdReturn } from './takeSingleReturn'
import { updateDenganIdUnikReturnDariKledo } from '../../hooks/returnHooks'

const SimpanIdUnikDariReturn: React.FC = () => {
  const { memo } = useParams<{ memo?: string }>()
  console.log('id sebagai parameter')
  const navigate = useNavigate()

  const [timeExceeded, setTimeExceeded] = useState(false)

  const updateSomeProperty = updateDenganIdUnikReturnDariKledo()
  const { loading, getIdAtReturn } = useIdReturn(memo)
  console.log({ getIdAtReturn })
  const invoiceId = getIdAtReturn?.id ?? null
  console.log({ invoiceId })

  useEffect(() => {}, [updateSomeProperty])

  useEffect(() => {
    if (invoiceId) {
      const timer = setTimeout(() => {
        setTimeExceeded(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [invoiceId])

  const handleButtonClick = async () => {
    if (memo && invoiceId) {
      try {
        const response = await updateSomeProperty.mutateAsync({
          id: invoiceId,
        })
        console.log('Invoice ID berhasil diperbarui:', response)
      } catch (error) {
        console.error('Gagal memperbarui Invoice ID:', error)
      }
    } else {
    }

    // navigate(`/sudah-validasi/${id}`)
  }

  return (
    <>
      {!loading && invoiceId && timeExceeded && (
        <Modal
          title="Return Berhasil Dibuat, Klik Lanjutkan"
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
            Lanjutkan Return
          </Button>
        </Modal>
      )}
    </>
  )
}

export default SimpanIdUnikDariReturn

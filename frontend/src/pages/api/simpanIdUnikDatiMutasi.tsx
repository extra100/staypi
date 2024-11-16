import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal, Button, Spin } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

import { useIdMutation } from './takeSingleMutation'
import { updateDenganIdUnikMutasiDariKledo } from '../../hooks/pindahHooks'

const SimpanIdUnikDariMutasi: React.FC = () => {
  const [showButtons, setShowButtons] = useState(false)
  const [loading, setLoading] = useState(true)
  const currentDate = dayjs()
  const [startDate, setStartDate] = useState<Dayjs>(currentDate)

  const { ref_number } = useParams<{ ref_number?: string }>()
  const navigate = useNavigate()

  const updateHanyaId = updateDenganIdUnikMutasiDariKledo()
  const { getIdAtMutation } = useIdMutation(ref_number as string)
  console.log({ getIdAtMutation })
  console.log({ updateHanyaId })

  const invoiceId = getIdAtMutation?.id ?? null
  const idPadaItems =
    getIdAtMutation?.items?.map((item: any) => ({
      id: item.id,
      finance_account_id: item.finance_account_id,
    })) || []
  console.log({ idPadaItems })

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const updateInvoiceId = async () => {
    if (!ref_number || !invoiceId || idPadaItems.length === 0) {
      console.warn(
        'Tidak dapat memperbarui karena data berikut belum tersedia:',
        {
          ref_number,
          invoiceId,
          idPadaItems,
        }
      )
      return
    }

    try {
      const response = await updateHanyaId.mutateAsync({
        ref_number,
        id: invoiceId,
        items: idPadaItems,
      })

      console.log('Invoice ID dan items berhasil diperbarui:', response)
    } catch (error) {
      console.error('Gagal memperbarui Invoice ID dan items:', error)
    }
  }

  const handleButtonClick = () => {
    setLoading(true)
    setTimeout(() => {
      updateInvoiceId()
      navigate(`/detailkledo/${ref_number}`)
    }, 100)
  }

  return (
    <Modal
      title="Mutasi Berhasil Dibuat, Klik Lanjutkan"
      //   open={!!(showButtons && invoiceId && idPadaItems.length > 0)}
      footer={null}
      style={{ textAlign: 'center' }}
      bodyStyle={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
      }}
    >
      {loading ? (
        <Spin />
      ) : (
        <Button type="primary" onClick={handleButtonClick}>
          Lanjutkan Mutasi
        </Button>
      )}
    </Modal>
  )
}

export default SimpanIdUnikDariMutasi

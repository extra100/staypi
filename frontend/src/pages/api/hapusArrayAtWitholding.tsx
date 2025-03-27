import { Button, Row, Col, Typography } from 'antd'
import { useParams } from 'react-router-dom'

import {
  useDeleteWitholdingMutation,
  useGetTransactionByIdQuery,
} from '../../hooks/transactionHooks'

const { Text } = Typography
const DeleteWitholdingPage: React.FC = () => {
  const { ref_number } = useParams<{ ref_number: string }>()

  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )
  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  const witholdings = getPosDetail?.witholdings || []

  const deleteWitholdingMutation = useDeleteWitholdingMutation()

  const handleDelete = (witholdingId: string) => {
    deleteWitholdingMutation.mutate({
      ref_number: ref_number as string,
      witholdingId,
    })
  }
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }
  return (
    <>
      {witholdings.map((witholding: any, index: number) => (
        <Row key={index} style={{ marginTop: '8px' }}>
          <Col span={12} style={{ textAlign: 'left' }}>
            <Text strong>{witholding.name}</Text>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text strong>{formatNumber(witholding.down_payment)}</Text>
            <Button
              type="primary"
              danger
              onClick={() => handleDelete(witholding._id)}
              style={{ marginLeft: '8px' }}
            >
              Hapus
            </Button>
          </Col>
        </Row>
      ))}
    </>
  )
}

export default DeleteWitholdingPage

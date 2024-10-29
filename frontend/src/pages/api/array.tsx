// import React, { useState } from 'react';
// import { Button, Table, Typography, message, Spin } from 'antd';
// import { useParams } from 'react-router-dom';

// import {
//   useGetTransactionByIdQuery,
//   useUpdateWitholdingPercentMutation,
// } from '../../hooks/transactionHooks';

// const { Text } = Typography;

// const EditWitholdingPercentPage: React.FC = () => {
//   const { ref_number } = useParams<{ ref_number: string }>();
//   const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({});

//   const { data: allTransactions } = useGetTransactionByIdQuery(ref_number as string);
//   const getPosDetail = allTransactions?.find(
//     (transaction: any) => transaction.ref_number === ref_number
//   );
//   const witholdings = getPosDetail?.witholdings || [];

//   const updateWitholdingPercentMutation = useUpdateWitholdingPercentMutation();

//   const handleVoid = (witholdingId: string, currentPercent: number) => {
//     setLoadingIds((prev) => ({ ...prev, [witholdingId]: true })); // Set loading untuk witholding yang diklik

//     const newPercent = currentPercent === 0 ? 1 : 0; // Mengubah persen menjadi 1 jika 0, sebaliknya menjadi 0

//     updateWitholdingPercentMutation.mutate(
//       {
//         ref_number: ref_number as string,
//         witholdingId,
//         newPercent, // Gunakan newPercent yang sudah ditentukan
//       },
//       {
//         onSuccess: () => {
//           // Set timeout untuk loading 3 detik
//           setTimeout(() => {
//             setLoadingIds((prev) => ({ ...prev, [witholdingId]: false }));
//             message.success(currentPercent === 0
//               ? 'Withholding percent updated to 1 (DIBATALKAN)!'
//               : 'Withholding percent updated to 0 (BELUM DIBATALKAN)!'
//             ); // Tampilkan pesan sukses
//           }, 3000);
//         },
//         onError: () => {
//           setLoadingIds((prev) => ({ ...prev, [witholdingId]: false }));
//           message.error('Failed to update withholding percent!'); // Tampilkan pesan error
//         },
//       }
//     );
//   };

//   const formatNumber = (num: number) => {
//     return num.toLocaleString('en-US');
//   };

//   // Kolom untuk tabel
//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Down Payment',
//       dataIndex: 'down_payment',
//       key: 'down_payment',
//       render: (text: number) => <Text strong>{formatNumber(text)}</Text>,
//     },
//     {
//       title: 'Status',
//       key: 'status',
//       render: (record: any) => (
//         <Text strong>{record.witholding_percent === 0 ? 'BELUM DIBATALKAN' : 'DIBATALKAN'}</Text>
//       ),
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_: any, record: any) => (
//         <Button
//           type="primary"
//           onClick={() => handleVoid(record._id, record.witholding_percent)} // Pass current percent
//           loading={loadingIds[record._id]} // Spinner loading hanya pada baris yang diklik
//         >
//           {loadingIds[record._id] ? <Spin size="small" /> : (record.witholding_percent === 0 ? 'Void' : 'Unvoid')}
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Table
//       dataSource={witholdings}
//       columns={columns}
//       rowKey="_id" // Gunakan _id sebagai kunci baris
//       pagination={false} // Nonaktifkan pagination jika tidak diperlukan
//     />
//   );
// };

// export default EditWitholdingPercentPage;

// import React, { useState } from 'react'
// import { Button, Table, Typography, message, Spin } from 'antd'
// import { useParams } from 'react-router-dom'

// import {
//   useGetTransactionByIdQuery,
//   useUpdateWitholdingPercentMutation,
// } from '../../hooks/transactionHooks'

// const { Text } = Typography

// const EditWitholdingPercentPage: React.FC = () => {
//   const { ref_number } = useParams<{ ref_number: string }>()
//   const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({}) // State untuk loading

//   const { data: allTransactions } = useGetTransactionByIdQuery(
//     ref_number as string
//   )
//   const getPosDetail = allTransactions?.find(
//     (transaction: any) => transaction.ref_number === ref_number
//   )
//   const witholdings = getPosDetail?.witholdings || []

//   const updateWitholdingPercentMutation = useUpdateWitholdingPercentMutation()

//   const handleVoid = (witholdingId: string) => {
//     setLoadingIds((prev) => ({ ...prev, [witholdingId]: true })) // Set loading untuk witholding yang diklik
//     updateWitholdingPercentMutation.mutate(
//       {
//         ref_number: ref_number as string,
//         witholdingId,
//         newPercent: 1, // Mengubah dengan persentase menjadi 1
//       },
//       {
//         onSuccess: () => {
//           // Set timeout untuk loading 3 detik
//           setTimeout(() => {
//             setLoadingIds((prev) => ({ ...prev, [witholdingId]: false })) // Reset loading untuk witholding yang diklik
//             message.success('Withholding percent updated successfully!') // Tampilkan pesan sukses
//           }, 3000)
//         },
//         onError: () => {
//           setLoadingIds((prev) => ({ ...prev, [witholdingId]: false })) // Reset loading jika ada error
//           message.error('Failed to update withholding percent!') // Tampilkan pesan error
//         },
//       }
//     )
//   }

//   const formatNumber = (num: number) => {
//     return num.toLocaleString('en-US')
//   }

//   // Kolom untuk tabel
//   const columns = [
//     {
//       title: 'Kas & Bank',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Tanggal Bayar',
//       dataIndex: 'trans_date',
//       key: 'trans_date',
//     },
//     {
//       title: 'Down Payment',
//       dataIndex: 'down_payment',
//       key: 'down_payment',
//       render: (text: number) => <Text strong>{formatNumber(text)}</Text>,
//     },
//     {
//       title: 'Status',
//       key: 'status',
//       render: (record: any) => (
//         <Text strong>
//           {record.witholding_percent === 0 ? 'BELUM DIBATALKAN' : 'DIBATALKAN'}
//         </Text>
//       ),
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_: any, record: any) => (
//         <Button
//           type="primary"
//           onClick={() => handleVoid(record._id)}
//           loading={loadingIds[record._id]} // Spinner loading hanya pada baris yang diklik
//         >
//           {loadingIds[record._id] ? <Spin size="small" /> : 'Void'}
//         </Button>
//       ),
//     },
//   ]

//   return (
//     <Table
//       dataSource={witholdings}
//       columns={columns}
//       rowKey="_id" // Gunakan _id sebagai kunci baris
//       pagination={false} // Nonaktifkan pagination jika tidak diperlukan
//     />
//   )
// }

// export default EditWitholdingPercentPage

// import React, { useState } from 'react';
// import { Button, Row, Col, Typography, message, Spin } from 'antd';
// import { useParams } from 'react-router-dom';

// import {
//   useGetTransactionByIdQuery,
//   useUpdateWitholdingPercentMutation,
// } from '../../hooks/transactionHooks';

// const { Text } = Typography;

// const EditWitholdingPercentPage: React.FC = () => {
//   const { ref_number } = useParams<{ ref_number: string }>();
//   const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({}); // State untuk loading

//   const { data: allTransactions } = useGetTransactionByIdQuery(ref_number as string);
//   const getPosDetail = allTransactions?.find(
//     (transaction: any) => transaction.ref_number === ref_number
//   );
//   const witholdings = getPosDetail?.witholdings || [];

//   const updateWitholdingPercentMutation = useUpdateWitholdingPercentMutation();

//   const handleVoid = (witholdingId: string) => {
//     setLoadingIds((prev) => ({ ...prev, [witholdingId]: true })); // Set loading untuk witholding yang diklik
//     updateWitholdingPercentMutation.mutate({
//       ref_number: ref_number as string,
//       witholdingId,
//       newPercent: 1, // Mengubah dengan persentase menjadi 1
//     }, {
//       onSuccess: () => {
//         // Set timeout untuk loading 3 detik
//         setTimeout(() => {
//           setLoadingIds((prev) => ({ ...prev, [witholdingId]: false })); // Reset loading untuk witholding yang diklik
//           message.success('Withholding percent updated successfully!'); // Tampilkan pesan sukses
//         }, 3000);
//       },
//       onError: () => {
//         setLoadingIds((prev) => ({ ...prev, [witholdingId]: false })); // Reset loading jika ada error
//         message.error('Failed to update withholding percent!'); // Tampilkan pesan error
//       }
//     });
//   };

//   const formatNumber = (num: number) => {
//     return num.toLocaleString('en-US');
//   };

//   return (
//     <>
//       {witholdings.map((witholding: any, index: number) => (
//         <Row key={index} style={{ marginTop: '8px' }}>
//           <Col span={12} style={{ textAlign: 'left' }}>
//             <Text strong>{witholding.name}</Text>
//           </Col>
//           <Col span={12} style={{ textAlign: 'right' }}>
//             <Text strong>{formatNumber(witholding.down_payment)}</Text>
//             <Button
//               type="primary"
//               onClick={() => handleVoid(witholding._id)}
//               style={{ marginLeft: '8px' }}
//             >
//               {loadingIds[witholding._id] ? <Spin size="small" /> : 'Void'}
//             </Button>
//           </Col>
//         </Row>
//       ))}
//     </>
//   );
// };

// export default EditWitholdingPercentPage;
;<></>

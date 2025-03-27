// import React, { useState, useMemo } from 'react'
// import { Select } from 'antd'

// import { useGetGudangsQuery } from '../../hooks/warehouseHooks'
// import { useGetProductsWithWarehouseQty } from './StokBarang'

// const { Option } = Select

// const Ulang: React.FC = () => {
//   const { products } = useGetProductsWithWarehouseQty()
//   const { data: warehouses } = useGetGudangsQuery()

//   const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(
//     null
//   )

//   const handleWarehouseChange = (value: number) => {
//     setSelectedWarehouse(value)
//   }

//   const warehouseArray = Array.isArray(warehouses) ? warehouses : []

//   // Memoized quantities based on selected warehouse
//   const warehouseQuantities = useMemo(() => {
//     const quantities: { [key: number]: number } = {}
//     if (selectedWarehouse !== null) {
//       products?.forEach((product) => {
//         const warehouseQty = product.warehouse_qty.find(
//           (warehouse) => warehouse.id === selectedWarehouse
//         )
//         if (warehouseQty) {
//           quantities[product.id] = warehouseQty.qty
//         } else {
//           quantities[product.id] = 0
//         }
//       })
//     }
//     return quantities
//   }, [selectedWarehouse, products])

//   return (
//     <div>
//       <Select
//         placeholder="Select Barang"
//         style={{ width: 300, marginBottom: 16 }}
//       >
//         {products?.map((product) => (
//           <Option key={product.id} value={product.id}>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span>{product.name}</span>
//               <span>{product.price}</span>
//               <span>
//                 {warehouseQuantities[product.id] !== undefined
//                   ? warehouseQuantities[product.id]
//                   : 'N/A'}
//               </span>
//             </div>
//           </Option>
//         ))}
//       </Select>

//       <Select
//         placeholder="Select Warehouse"
//         style={{ width: 200 }}
//         onChange={handleWarehouseChange}
//       >
//         {warehouseArray.map((warehouse) => (
//           <Option key={warehouse.id} value={warehouse.id}>
//             {warehouse.name}
//           </Option>
//         ))}
//       </Select>
//     </div>
//   )
// }

// export default Ulang
export {}

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, DatePicker, Button, Select } from 'antd';
import dayjs from 'dayjs';
import { useWarehouseStock } from './fetchSemuaStok';
import UserContext from '../../contexts/UserContext';
import { useGetBarangsQuery } from '../../hooks/barangHooks';

const { RangePicker } = DatePicker;
const { Option } = Select;

const categories = [
  { id: 5, name: 'ATAP' },
  { id: 8, name: 'BAUT' },
  { id: 12, name: 'TRIPLEK' },
  { id: 16, name: 'ASET TETAP KENDARAAN' },
  { id: 6, name: 'BESI BETON' },
  { id: 7, name: 'BAJA' },
  { id: 10, name: 'BESI KOTAK' },
  { id: 13, name: 'CET' },
  { id: 15, name: 'ASET TETAP BANGUNAN' },
  { id: 20, name: 'TANAH' },
  { id: 1, name: 'Other' },
  { id: 3, name: 'ASESORIS' },
  { id: 4, name: 'BESI' },
  { id: 9, name: 'GENTENG PASIR' },
  { id: 19, name: 'SPANDEK PASIR' },
  { id: 11, name: 'PIPA AIR' },
  { id: 17, name: 'MATERIAL PRODUKSI' },
  { id: 18, name: 'ASET TETAP PERALATAN' },
  { id: 21, name: 'KERAMIK' },
  { id: 2, name: 'PLAFON' },
];

const categoryMap = Object.fromEntries(categories.map((cat) => [cat.id, cat.name]));

const WarehouseStockTable: React.FC = () => {
  const { data: barangs } = useGetBarangsQuery();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<[string, string]>(['', '']);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const formattedDate = dayjs(selectedDates[0], 'DD-MM-YYYY').format('YYYY-MM-DD');

  useEffect(() => {
    if (user?.id_outlet) {
      setSelectedWarehouseId(Number(user.id_outlet));
    }
  }, [user]);

  const { warehouseStock } = useWarehouseStock(formattedDate, selectedWarehouseId ?? 0);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setSelectedDates(dateStrings);
  };

  const handleCategoryChange = (value: number) => {
    setSelectedCategory(value);
  };

  const filteredBarangs = selectedCategory
    ? barangs?.filter((barang) => barang.pos_product_category_id === selectedCategory)
    : barangs;

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const newWindow = window.open('', '', 'width=900,height=600');
      newWindow?.document.write(`
        <html>
          <head>
            <title>Cetak Stok Gudang</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>Stok Gudang (${selectedDates[0]} - ${selectedDates[1]})</h2>
            ${printContent}
          </body>
        </html>
      `);
      newWindow?.document.close();
      newWindow?.print();
    }
  };

  const columns = [
    {
      title: 'No',
      key: 'no',
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Kode', dataIndex: 'code', key: 'code' },
    { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
    { title: 'Kategori', dataIndex: 'pos_product_category_id', key: 'category', render: (id: number) => categoryMap[id] || 'Unknown' },
    { title: 'Stok', dataIndex: 'stock', key: 'stock' },
    { title: 'Fisik Stok', dataIndex: '', key: '' },
    { title: 'Selisih Stok', dataIndex: '', key: '' },
  ];

  return (
    <div>
      <RangePicker format="DD-MM-YYYY" onChange={handleDateChange} style={{ marginBottom: 16, marginRight: 16 }} />
      <Select
        placeholder="Pilih Kategori Produk"
        onChange={handleCategoryChange}
        allowClear
        style={{ width: 200, marginBottom: 16 }}
      >
        {categories.map((category) => (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handlePrint} style={{ marginBottom: 16 }}>
        Print
      </Button>
      <div ref={printRef}>
        <Table dataSource={filteredBarangs} columns={columns} rowKey="id" pagination={false} />
      </div>
    </div>
  );
};

export default WarehouseStockTable;

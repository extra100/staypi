import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import { useWarehouseStock } from './fetchSemuaStok';
import UserContext from '../../contexts/UserContext';

const { RangePicker } = DatePicker;

const WarehouseStockTable: React.FC = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<[string, string]>(['', '']);

  const formattedDate = dayjs(selectedDates[0], 'DD-MM-YYYY').format('YYYY-MM-DD');

  useEffect(() => {
    if (user?.id_outlet) {
      setSelectedWarehouseId(Number(user.id_outlet));
    }
  }, [user]);

  const { warehouseStock } = useWarehouseStock(formattedDate, selectedWarehouseId ?? 0);

  console.log({ warehouseStock, selectedWarehouseId });

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setSelectedDates(dateStrings);
  };

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
    { title: 'Kode', dataIndex: 'code', key: 'code' },
    { title: 'Nama Barang', dataIndex: 'name', key: 'name' },
    { title: 'Stok', dataIndex: 'stock', key: 'stock' },
    { title: 'Fisik Stok', dataIndex: '', key: '' },
    { title: 'Selisih Stok', dataIndex: '', key: '' },
  ];

  return (
    <div>
      <RangePicker format="DD-MM-YYYY" onChange={handleDateChange} style={{ marginBottom: 16 }} />
      <Button type="primary" onClick={handlePrint} style={{ marginBottom: 16 }}>
        Print
      </Button>
      <div ref={printRef}>
        <Table dataSource={warehouseStock} columns={columns} rowKey="id" pagination={false} />
      </div>
    </div>
  );
};

export default WarehouseStockTable;

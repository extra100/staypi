export type Stok = {
  _id: string

  jumlah_stok: number
  id_data_barang: string
  id_outlet: string
  [key: string]: number | string // Tanda tangan indeks yang mengizinkan number atau string
}

export type CartItem = {
  quantity: number
  _id: string
  id_data_barang: number
  nama_barang: string

  stok: number
  satuan: number
  harga_beli: number
  harga_jual: number
  supplier: number
  barcode: number
  harga_jual_semi: number
  harga_jual_grosir: number
}

export type ShippingAddress = {
  fullName: string
  address: string
  city: string
  country: string
  postalCode: string
}

export type Cart = {
  cartItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}

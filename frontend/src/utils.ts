import { ApiError } from './types/ApiError'
import { CartItem } from './types/Cart'
import { Product } from './types/Product'

export const getError = (error: ApiError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message
}

// export const convertProductToCartItem = (product: Product): CartItem => {
// const cartItem: CartItem = {
// _id: product._id,
// id_data_barang: product.id_data_barang,
// nama_barang: product.nama_barang,
// satuan: product.satuan,
// stok: product.stok,
// satuan: product.satuan,
// harga_beli: product.harga_beli,
// harga_jual: product.harga_jual,
// supplier: product.supplier,
// barcode: product.barcode,
// harga_jual_semi: product.harga_jual_semi,
// harga_jual_grosir: product.harga_jual_grosir,
// quantity: 1,
// }
// return cartItem
// }

import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import App from './App'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from './Store'
import CartPage from './pages/CartPage'
import SignupPage from './pages/SignupPage'
import ShippingAddressPage from './pages/ShippingAddressPage'
import PaymentMethodPage from './pages/PaymentMethodPage'
import PlaceOrderPage from './pages/PlaceOrderPage'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import ProfilePage from './pages/ProfilePage'
import SigninPage from './pages/SinginPage'
import ProtectedRoute from './components/protectedRoute'

import OutletPage from './pages/outlet/OutletPage'

// import TransactionPages from './pages/transaction/TransactionPage'

import StokBarangPage from './pages/api/StokBarangPage'
// import WarehouseDropdown from './pages/api/WarehouseDropdown'
import { SaveApi } from './pages/api/SaveApi'
import SaveInvoiceComponent from './pages/api/SaveApiFe'
// import KasPenjualan from './pages/api/KasoPenjualan'

import FinanceAccountIDSameTable from './pages/transaction/POS/FinanceAccountIDSameTables'
import FinanceAccountDisplay from './pages/api/FiaFe'

import DetailKledo from './pages/api/DetailKLedo'
import WarehouseStock from './pages/api/Gerah'
import StokWarehouseComponent from './pages/api/Gerah'
import SelectIdForm from './pages/api/awal'
import nestedObjectooo from './pages/api/NestedObject'
import NestedObjectooo from './pages/api/NestedObject'
import Hafalan from './pages/api/Hafal'
import TransferMasukGudang from './pages/api/TransferGudang'

import ListTransaksi from './pages/KledoList'
import ProductStocksTable from './pages/api/uiPO'
import ListPindah from './pages/api/listPindah'
import WarehouseTransferDetail from './pages/api/detailPindah'
import ProductLookup from './pages/api/SingleProductPage'
import ProductsComponent from './pages/api/Cepatin'
import ProductList from './pages/api/Cepatin'
import ProductTable from './pages/api/Cepatin'

import BatchProcessWarehouses from './pages/saveWarehouse'
import BatchProcessTags from './pages/api/SaveTags'
import BatchProcessContacts from './pages/api/SaveContact'
import BarangList from './pages/api/barangPage'
import TransactionTable from './pages/api/ListTransaksi'
import Receipt from './pages/api/printNota'
import ListStok from './pages/api/semuaStok'
import ReceiptJalan from './pages/api/ReceiptJalan'
import BatchProcessProducts from './pages/api/saveProduct'
import BatchProcessBarangTerjuals from './pages/api/saveBarangTerjual'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="cart" element={<CartPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        //
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/outlet" element={<OutletPage />} />
      </Route>
      <Route path="/ibo" element={<StokBarangPage />} />
      <Route path="/save" element={<SaveInvoiceComponent />} />
      <Route path="/gerah" element={<StokWarehouseComponent />} />
      <Route path="/awal" element={<SelectIdForm />} />
      <Route path="/neob" element={<NestedObjectooo />} />
      <Route path="/hafal" element={<Hafalan />} />
      <Route path="/tmg" element={<TransferMasukGudang />} />
      <Route path="/saveproduct" element={<BatchProcessProducts />} />
      <Route path="/savebarang" element={<BatchProcessProducts />} />
      <Route path="/savewarehouses" element={<BatchProcessWarehouses />} />
      <Route path="/savetag" element={<BatchProcessTags />} />
      <Route path="/savecontact" element={<BatchProcessContacts />} />
      <Route path="/po" element={<ProductStocksTable />} />
      <Route path="/langsungstok" element={<ListStok />} />
      <Route path="/terjual" element={<BatchProcessBarangTerjuals />} />
      <Route
        path="/FinanceAccountIDSameTable"
        element={<FinanceAccountIDSameTable />}
      />
      <Route path="/fiac" element={<FinanceAccountDisplay />} />
      <Route path="/listkledo" element={<ListTransaksi />} />
      <Route path="/detailkledo/:ref_number" element={<DetailKledo />} />
      <Route path="/printnota/:ref_number" element={<Receipt />} />
      <Route path="/printsuratjalan/:ref_number" element={<ReceiptJalan />} />
      <Route path="/listpindah" element={<ListPindah />} />
      <Route path="/single" element={<ProductLookup />} />
      <Route path="/tabelbarang" element={<ProductTable />} />
      <Route path="/barangdb" element={<BarangList />} />
      <Route path="/transaksi" element={<TransactionTable />} />
      <Route path="/printnota" element={<Receipt />} />
      <Route
        path="/transfer-detail/:ref_number"
        element={<WarehouseTransferDetail />}
      />
    </Route>
  )
)

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      {/* <PayPalScriptProvider options={{ 'client-id': 'sb' }} deferLoading={true}> */}
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
      {/* </PayPalScriptProvider> */}
    </StoreProvider>
  </React.StrictMode>
)

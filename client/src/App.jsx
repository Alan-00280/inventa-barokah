import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css"
import NotFound from "./pages/error/NotFound";
import DashboardIndex from "./pages/dashboard/dashboardIndex";
import TemplateDashboard from "./components/layout/templateDashboard";
import MasterDataIndex from "./pages/master-data/MasterDataIndex";
import MasterDataBarang from "./pages/master-data/MasterDataBarang";
import MasterDataVendor from "./pages/master-data/MasterDataVendor";
import MasterDataPengguna from "./pages/master-data/MasterDataPengguna";
import TransaksiIndexDashboard from "./pages/transaction/transaksiDashboardIndex";
import TransaksiPengadaan from "./pages/transaction/transaksiPengadaan";
import TransaksiPenerimaan from "./pages/transaction/transaksiPenerimaan";
import TransaksiPenjualan from "./pages/transaction/transaksiPenjualan";
import PenerimaanPengadaan from "./pages/transaction/penerimaan/penerimaanPengadaan";
import KartuStok from "./pages/transaction/kartuStok";
import IndexPenerimaan from "./pages/transaction/penerimaan/IndexPenerimaan";
import ShowPenerimaan from "./pages/transaction/penerimaan/ShowPenerimaan";
import PengadaanCreate from "./pages/transaction/pengadaan/pengadaanCreate";
import ShowPengadaan from "./pages/transaction/pengadaan/showPengadaan";
import MasterDataMargin from "./pages/master-data/MasterDataMargin";
import PenjualanCreate from "./pages/transaction/penjualan/penjualanCreate";
import ShowPenjualan from "./pages/transaction/penjualan/showPenjualan";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<><h1> Landing Page </h1> <br/> <a href="/dashboard">dashboard</a></>} />

        <Route path="dashboard" element={<TemplateDashboard />} >
          <Route index element={<DashboardIndex />} />
        </Route>

        <Route path="master-data" element={<TemplateDashboard />}>
          <Route index element={<MasterDataIndex />} />
          <Route path="pengguna" element={<MasterDataPengguna />} />
          <Route path="barang" element={<MasterDataBarang />} />
          <Route path="vendor" element={<MasterDataVendor />} />
          <Route path="margin" element={<MasterDataMargin />} />
        </Route>

        <Route path="transaksi" element={<TemplateDashboard />}>
          <Route index element={<TransaksiIndexDashboard />} />

          <Route path="kartu-stok" element={<KartuStok />} />

          <Route path="pengadaan" element={<TransaksiPengadaan />} />

          <Route path="penerimaan" element={<IndexPenerimaan />}/>
          <Route path="terima-pengadaan" element={<TransaksiPenerimaan />}/>
          <Route path="penerimaan-pengadaan/:id" element={<PenerimaanPengadaan />}/>

          <Route path="penjualan" element={<TransaksiPenjualan />}/>
        </Route>

        <Route path="penerimaan" element={<TemplateDashboard />}>
          <Route path=":id" element={<ShowPenerimaan />} />
        </Route>

        <Route path="pengadaan" element={<TemplateDashboard />}>
          <Route path="create" element={<PengadaanCreate />} />
          <Route path=":id" element={<ShowPengadaan />} />
        </Route>

        <Route path="penjualan" element={<TemplateDashboard />}>
          <Route path="create" element={<PenjualanCreate />} />
          <Route path=":id" element={<ShowPenjualan />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App

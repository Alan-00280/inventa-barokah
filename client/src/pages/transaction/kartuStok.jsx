import axios from "axios";
import { useEffect, useState } from "react";
import localAPIRoute from "../../constant/APIRoute";
import { ChevronDown } from "lucide-react";

export default function KartuStok() {
    const [kartuStok, setKartuStok] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeOnly, setActiveOnly] = useState(true);

    const handleActive = (e) => {
        setActiveOnly(e.target.value !== 'all')
    }
    
    const formatKartuStok = (res) => {
        let fetchedKartu = res.data.data

        {/* {
            "idkartu_stok": 3,
            "jenis_transaksi": "T",
            "idtransaksi": null,
            "waktu": "2025-11-05T19:37:49.000Z",
            "masuk": 120,
            "keluar": 0,
            "stok": 120,
            "barang": "Beras Premium",
            "status_barang": 1,
            "satuan": "Kg"
        } */}
        
        fetchedKartu = fetchedKartu.map((item)=>{
            const status = (item.status_barang === 1) ? 'aktif' : 'tidak aktif'

            let jenisTransaksi
            switch (item.jenis_transaksi) {
                case 'T':
                    jenisTransaksi = 'Penerimaan'
                    break;
                case 'J':
                    jenisTransaksi = 'Penjualan'
                    break;
                case 'A':
                    jenisTransaksi = 'Pengadaan'
                    break;
                default:
                    jenisTransaksi = 'error-type'
                    break;
            }

            const stokJumlah = (!item.stok) ? 0 : (item.stok + " " + item.satuan);
            const masukFecthed = item.masuk + " " + item.satuan
            const keluarFecthed = item.keluar + " " + item.satuan
            return {
                ...item,
                status: status,
                jenis_transaksi: jenisTransaksi,
                stok: stokJumlah,
                masuk: masukFecthed,
                keluar: keluarFecthed
            }
        })

        return fetchedKartu
    }
    
    useEffect(() => {
        if (activeOnly) {
            axios.get(localAPIRoute+'/barang/kartu-stok')
                .then((res) => {
                    console.log(res)
                    const formatedKartuStok = formatKartuStok(res)
                    setKartuStok(formatedKartuStok)
                    // console.log(barangStok.length > 0)
                    setIsLoading(false)
                })
                .catch((err) => {
                    console.log(err);
                    setError(err);
                    setIsLoading(false);
                })
        } else {
            axios.get(localAPIRoute+'/barang/kartu-stok', {
                params: {
                    all: 'true'
                }
            })
                .then((res) => {
                    const formatedKartuStok = formatKartuStok(res)
                    // console.log(formatedBarang)
                    setKartuStok(formatedKartuStok)
                    setIsLoading(false)
                })
                .catch((err) => {
                    console.log(err.message);
                    setError(err);
                    setIsLoading(false)
                })
        }
    }, [activeOnly])
    
    const KartuStokBody = () => {
        const kartuStokBody = (kartuStok.length > 0) ? (
            <tbody>
                { kartuStok.map((item) => (
                    <tr key={item.idkartu_stok}>
                        <td className="px-4 py-2 border-b text-gray-700">{item.idkartu_stok}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{item.barang + ' (' + item.status + ')'}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{item.jenis_transaksi}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{item.waktu}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{item.masuk}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{item.keluar}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{item.stok}</td>
                    </tr>
                ))
                }
            </tbody>
        ) : (
            <tbody>
                <tr>
                    <td className="px-4 py-2 border-b text-gray-700 italic">No Available Data</td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    
                </tr>
            </tbody>
        )

        return (
            kartuStokBody
        )
    }

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Transaksi</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-600">Barang - Kartu Stok</h2>

            <div className="relative inline-block">
                <select name="Select Active" onChange={handleActive} className="border border-gray-300 rounded-lg px-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white my-3 appearance-none hover:border-blue-300 hover:border-2">
                    <option value="active">Aktif</option>
                    <option value="all">All</option>
                </select>

                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
            </div>
            
            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}


            {!isLoading && !error &&
            (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border-b text-left">ID Kartu Stok</th>
                                <th className="px-4 py-2 border-b text-left">Barang</th>
                                <th className="px-4 py-2 border-b text-left">Jenis Transaksi</th>
                                <th className="px-4 py-2 border-b text-left">Waktu</th>
                                <th className="px-4 py-2 border-b text-left">Masuk</th>
                                <th className="px-4 py-2 border-b text-left">Keluar</th>
                                <th className="px-4 py-2 border-b text-left">Stok</th>
                            </tr>
                        </thead>
                        <KartuStokBody />
                    </table>
                </div>
            )}

        </div>
    )
}
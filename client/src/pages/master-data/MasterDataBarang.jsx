import axios from "axios";
import { useEffect, useState } from "react";
import localAPIRoute from "../../constant/APIRoute";
import { ChevronDown } from "lucide-react";
import DialogCreateBarang from "./CUD/CreateBarang";


export default function MasterDataBarang() {
    const [barangStok, setBarangStok] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeOnly, setActiveOnly] = useState(true);

    const handleActive = (e) => {
        setActiveOnly(e.target.value !== 'all')
    }
    
    const formatFetchedBarang = (res) => {
        let fetchedBrg = res.data.barang[0]
        
        fetchedBrg = fetchedBrg.map((barang)=>{
            const status = (barang.status === 1) ? 'aktif' : 'tidak aktif'
            let jenisBrg
            switch (barang.jenis) {
                case 'D':
                    jenisBrg = 'Dagang'
                    break;
                case 'B':
                    jenisBrg = 'Bahan Baku'
                    break;
                case 'A':
                    jenisBrg = 'Aset'
                    break;
                default:
                    jenisBrg = 'error-type'
                    break;
            }
            const stokJumlah = (!barang.stok) ? 0 : barang.stok;
            return {
                ...barang,
                status: status,
                jenis: jenisBrg,
                stok: stokJumlah
            }
        })

        return fetchedBrg
    }
    
    useEffect(() => {
        if (activeOnly) {
            axios.get(localAPIRoute+'/barang/with-stok')
                .then((res) => {
                    const formatedBarang = formatFetchedBarang(res)
                    setBarangStok(formatedBarang)
                    // console.log(barangStok.length > 0)
                    setIsLoading(false)
                })
                .catch((err) => {
                    console.log(err);
                    setError(err);
                    setIsLoading(false);
                })
        } else {
            axios.get(localAPIRoute+'/barang/with-stok', {
                params: {
                    all: 'true'
                }
            })
                .then((res) => {
                    const formatedBarang = formatFetchedBarang(res)
                    console.log(formatedBarang)
                    setBarangStok(formatedBarang)
                    setIsLoading(false)
                })
                .catch((err) => {
                    console.log(err.message);
                    setError(err);
                    setIsLoading(false)
                })
        }
    }, [activeOnly])
    
    const BarangTableBody = () => {
        const barangBody = (barangStok.length > 0) ? (
            <tbody>
                { barangStok.map((barang) => (
                    <tr key={barang.idbarang}>
                        <td className="px-4 py-2 border-b text-gray-700">{barang.idbarang}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{barang.nama}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{barang.jenis}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{barang.status}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{'Rp'+(barang.harga).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{barang.satuan}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{barang.stok}</td>
                    </tr>
                ))
                }
            </tbody>
        ) : (
            <tbody>
                <tr>
                    <td className="px-4 py-2 border-b text-gray-700 italic">No Available Data</td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                </tr>
            </tbody>
        )

        return (
            barangBody
        )
    }

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Master Data</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-600">Barang</h2>

            <div className="flex gap-2">
                <div className="relative inline-block">
                    <select name="Select Active" onChange={handleActive} className="border border-gray-300 rounded-lg px-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white my-3 appearance-none hover:border-blue-300 hover:border-2">
                        <option value="active">Aktif</option>
                        <option value="all">All</option>
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>

                <DialogCreateBarang />
            </div>

            
            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error &&
            (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border-b text-left">ID Barang</th>
                                <th className="px-4 py-2 border-b text-left">Nama</th>
                                <th className="px-4 py-2 border-b text-left">Jenis</th>
                                <th className="px-4 py-2 border-b text-left">Status</th>
                                <th className="px-4 py-2 border-b text-left">Harga (per satuan)</th>
                                <th className="px-4 py-2 border-b text-left">Satuan</th>
                                <th className="px-4 py-2 border-b text-left">Stok</th>
                            </tr>
                        </thead>
                        <BarangTableBody />
                    </table>
                </div>
            )}

        </div>
    )
}

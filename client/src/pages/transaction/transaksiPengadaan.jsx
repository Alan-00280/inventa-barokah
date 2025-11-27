import axios from "axios";
import localAPIRoute from "../../constant/APIRoute";
import { useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import Logger from "../../components/logger";
import PengadaanList from "./pengadaanUtils/pengadaanCard";
import { useNavigate } from "react-router";


export default function TransaksiPengadaan() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uncomfirmeddOnly, setUncomfirmeddOnly] = useState(true);

    const navigate = useNavigate();
    
    //? Handling filter aktif 
    const handleActive = (e) => {
        setUncomfirmeddOnly(e.target.value !== 'all')
    }
    
    //? Fetch Pengadaan
    const [pengadaan, setPengadaan] = useState([]);
    useEffect(() => {
        const fetchPengadaan = async () => {
            try {
                const fetchedPengadaan = await axios.get(localAPIRoute + '/pengadaan', {
                    params: { all: (uncomfirmeddOnly ? 'false' : 'true') }
                });
                setPengadaan(fetchedPengadaan.data.pengadaan);
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPengadaan()
    }, [uncomfirmeddOnly])

    //? Handling Deletion
    const handleDeletePengadaan = async (idPengadaan) => {
        // alert('Test delete: ' + idPengadaan)
        setIsLoading(true)
        try {
            const deletePengadaan = await axios.delete(localAPIRoute+'/pengadaan/'+idPengadaan)
        } catch (error) {
            alert(error)
            setError(error)
        } finally {
            setIsLoading(false)
            alert('Sukses hapus Pengadaan #'+idPengadaan)
            navigate('/transaksi/pengadaan')
        }
    }

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Transaksi</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-600">Pengadaan</h2>

            <div className="flex justify-between">
                <div className="relative inline-block">
                    <select name="Select Active" onChange={handleActive} className="border border-gray-300 rounded-lg px-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white my-3 appearance-none hover:border-blue-300 hover:border-2">
                        <option value="active">Diproses</option>
                        <option value="all">Semua</option>
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
                <div>
                    <a
                        href="/pengadaan/create"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Buat Pengadaan</span>
                    </a>
                </div>
            </div>


            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* <Logger Object={pengadaan} /> */}
            <PengadaanList data={pengadaan} f={{deletePengadaan: handleDeletePengadaan}} />
        </div>
    );
}

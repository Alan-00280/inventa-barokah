import axios from "axios";
import localAPIRoute from "../../constant/APIRoute";
import { useEffect, useState } from "react";
import PengadaanList from "./pengadaanUtils/pengadaanCard";
import { useLocation } from "react-router";


export default function TransaksiPengadaan() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { state } = useLocation();
    
    const [message, setMessage] = useState(state?.message || "")
    useEffect(()=> {
        if(message){
            const timer = setTimeout(() => {
                setMessage("")
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [message])
    
    //? PENGADAAN FECTH ?//
    const [pengadaan, setPengadaan] = useState([]);

    const [filters, setFilters] = useState({
        categories: 'unconfirmed',
        date: new Date().toISOString().split('T')[0],
        id: ''
    })
    
    useEffect(() => {
        const fetchPengadaan = async () => {
            setIsLoading(true)
            const params = new URLSearchParams();

            if(filters.categories == 'all') {params.append('all', 'true')}
            if(filters.id) {params.append('id', filters.id)}
            if(filters.date) {params.append('date', filters.date)}

            try {
                const res = await axios.get(`${localAPIRoute}/pengadaan?${params.toString()}`)
                setPengadaan(res.data.pengadaan)
            } catch (err) {
                setError(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPengadaan()
    }, [filters])

    return (
        <div className="p-6 font-sans">
            {message && (
            <div
                style={{
                animation: 'slideDownUp 3s ease-in-out forwards',
                animationName: 'slideDownUp'
                }}
                className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg px-6 py-3 z-50 text-gray-800 font-medium"
            >
                <style>{`
                @keyframes slideDownUp {
                    0% { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    10%, 90% { transform: translateX(-50%) translateY(0); opacity: 1; }
                    100% { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                }
                `}</style>
                {message}
            </div>
            )}

            <h1 className="text-2xl font-bold mb-2">Transaksi</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-600">Penerimaan</h2>

            <h2 id="terima-pengadaan" className="text-2xl font-semibold mb-4 text-barokah-600">Terima Pengadaan</h2>
            <div className="flex gap-3 mb-6">
                <select
                    className="px-2 py-1 rounded bg-white flex-1"
                    onClick={(e) => setFilters((p) => ({ ...p, categories: e.target.value }))}
                >
                    <option value={filters.categories}>{filters.categories == 'all' ? 'Semua' : 'Diproses'}</option>
                    <option value="unconfirmed" hidden={filters.categories == 'unconfirmed'}>Diproses</option>
                    <option value="all" hidden={filters.categories == 'all'}>Semua</option>
                </select>

                <input
                    type="text"
                    className="px-2 py-1 rounded border flex-3"
                    placeholder="Cari ID Pengadaan..."
                    value={filters.id}
                    onChange={(e) => setFilters((p) => ({ ...p, id: e.target.value }))}
                />

                <input
                    type="date"
                    className="px-2 py-1 rounded border flex-1"
                    value={filters.date}
                    onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
                />
            </div>

            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}

            <PengadaanList data={pengadaan} link="transaksi/penerimaan-pengadaan" />
        </div>
    );
}

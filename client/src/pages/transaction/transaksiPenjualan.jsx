import axios from "axios";
import localAPIRoute from "../../constant/APIRoute";
import { useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import Logger from "../../components/logger";
import PenjualanCard from "./penjualan/penjualanCard";
import { useLocation, useNavigate } from "react-router";

export default function TransaksiPenjualan() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    
    const navigate = useNavigate();

    //? Pesan Cefat ?//
    const { state } = useLocation()
    const [fMessage, setFMessage] = useState(state?.message || '')
    useEffect(()=>{
        if(fMessage) {
            const timer = setTimeout(()=>{
                setFMessage('')
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [fMessage])
    
    //? Filternya ?//
    const [filters, setFilters] = useState({
        id: '',
        date: new Date().toISOString().split('T')[0],
        margin: null
    })
    
    const handleFilter = (field, value) => {setFilters(prev=>(
        {
            ...prev,
            [field]: value
        }
    ))}
    
    //? Fetch Data Penjualan ?//
    const [penjualanData, setPenjualanData] = useState([])
    useEffect(() => {
        const fetchPenjualan = async () => {
            setIsLoading(true)
            const params = new URLSearchParams()

            if(filters.id) {params.append('id', filters.id)}
            if(filters.margin) {params.append('margin', filters.margin)}
            if(filters.date) {params.append('date', filters.date)}

            try {
                const fetchedPenjualan = await axios.get(localAPIRoute + '/penjualan?' + params.toString())
                setPenjualanData(fetchedPenjualan.data.penjualan)
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchPenjualan()
    }, [filters])

    const [marginData, setMarginData] = useState([]);
    //? Fetch Margin ?//
    useEffect(() => {
        const fetchMargin = async () => {
            try {
                setIsLoading(true)
                const fetchedMargin = await axios.get(localAPIRoute + '/penjualan/margin')
                setMarginData(fetchedMargin.data.margin)
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMargin()
    }, [])

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Transaksi</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-600">Penjualan</h2>
            {/* <Logger Object={marginData} /> */}

            {/* Pesan Cefat */}
            {fMessage && (
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
                {fMessage}
            </div>
            )}

            {/* Ini Filter */}
            <div className="flex justify-between items-start">
                <div className="flex gap-3">

                    <input
                        name="id"
                        type="text"
                        minLength={1}
                        placeholder="Cari dengan ID Penjualan..."
                        onChange={(e)=>handleFilter('id', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-64 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-blue-500 text-gray-700 bg-white 
                       hover:border-blue-400 transition"
                    />

                    <select
                        name="filter margin"
                        onChange={(e)=>handleFilter('margin', parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-64 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-blue-500 text-gray-700 bg-white 
                       hover:border-blue-400 transition"
                    >
                        <option value="">Filter by Margin</option>

                        {marginData.map((m) => (
                            <option key={m.idmargin_penjualan} value={m.persen}>
                                {m.persen || "load.."}% {(m.status==1) ? '(Aktif Sekarang)' : ''}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        name="filter tanggal"
                        value={filters.date}
                        onChange={e=>handleFilter('date', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-64
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-blue-500 text-gray-700 bg-white 
                       hover:border-blue-400 transition"
                    />
                </div>

                <div>
                    <a
                        href="/penjualan/create"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white 
                       font-medium px-4 py-2 rounded-lg shadow-sm 
                       hover:bg-blue-700 hover:shadow-md transition"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Penjualan</span>
                    </a>
                </div>
            </div>

            {/* <Logger Object={filters} /> */}

            {/* <Logger Object={penjualanData} /> */}
            {penjualanData && penjualanData.map(penjualan => (
                <PenjualanCard data={penjualan} onClick={() => navigate('/penjualan/' + penjualan.idpenjualan)} key={penjualan.idpenjualan} />
            ))}

            {penjualanData.length <= 0 && 
                <span className="my-2 block">No Data Penjualan Ditemukan . . .</span>
            }

        </div>
    );
}

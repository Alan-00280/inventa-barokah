import axios from "axios"
import localAPIRoute from "../../../constant/APIRoute"
import { useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react";
import Logger from "../../../components/logger";


export default function KonfirmasiPenerimaan({ data }) {
    const state = useLocation();
    const [mouseHoverBtn, setMouseHoverBtn] = useState(false)
    const params = new URLSearchParams(location.search)
    
    const [message, setMessage] = useState(params.get('err'))
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("")
            },5000)
            return () => clearTimeout(timer)
        }
    }, [message])
    

    const navigate = useNavigate();
    const handleConfirm = async (confirmed) => {
        if (data.valid) {
            try {
                const postPenerimaan = await axios.post(localAPIRoute + '/penerimaan', { ...confirmed, iduser: data.userID, idvendor: data.vendorID, idpengadaan: data.pengadaanID, pengadaanDone: data.pengadaanDone })

                navigate('/transaksi/terima-pengadaan', { state: { message: 'Berhasil Menambahkan Penerimaan!' } })
            } catch (err) {
                navigate(`/transaksi/penerimaan-pengadaan/${data.pengadaanID}?err=${err.response?.data?.err?.msg || JSON.stringify(err)}`)
                navigate(0)
                console.log(JSON.stringify(err))
            }
        }
    }

    return (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
            {/* <Logger Object={message} /> */}

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

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ringkasan Nilai Pengadaan</h2>

            <div className="grid grid-cols-4 gap-y-3 text-sm text-gray-700">
                <span className="font-medium">Sub Total</span>
                <span className="col-span-3">Rp {data.subtotal_nilai?.toLocaleString("id-ID")}</span>

                <span className="font-medium">PPN</span>
                <span className="col-span-3">{data.ppn} %</span>

                <span className="font-medium">Total</span>
                <span className="col-span-3 font-semibold text-gray-900">
                    Rp {(data.subtotal_nilai + (data.subtotal_nilai * (data.ppn / 100)))?.toLocaleString("id-ID")}
                </span>
            </div>

            {/* <Logger Object={data} /> */}

            <div className="mt-6 flex flex-col items-end gap-1">

                {mouseHoverBtn && !data.valid && (
                    <span className="absolute -bottom-75 right-35 text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-md z-40">
                        ❌ Data tidak valid!
                    </span>
                )}

                <button
                    className={`
            px-4 py-2 rounded-md shadow-sm font-medium transition transform
            ${(!data.status || !data.valid)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 text-white'
                        }
        `}
                    onClick={() => handleConfirm(data.confirmed)}
                    disabled={!data.status || !data.valid}
                    onMouseOver={!data.valid ? () => setMouseHoverBtn(true) : undefined}
                    onMouseOut={!data.valid ? () => setMouseHoverBtn(false) : undefined}
                >
                    {!data.status ? 'Telah dikonfirmasi' : 'Konfirmasi Penerimaan'}
                </button>

            </div>

        </div>
    )
}
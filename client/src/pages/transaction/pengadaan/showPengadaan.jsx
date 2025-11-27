import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import localAPIRoute from "../../../constant/APIRoute";
import Logger from "../../../components/logger";
import DetilPengadaanCards from "./detilPengadaanCard";
import { Trash2 } from "lucide-react";


export default function ShowPengadaan() {
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [pengadaan, setPengadaan] = useState({});
    const [detilPengadaan, setDetilPengadaan] = useState([]);

    useEffect(() => {
        const fetchPengadaan = async () => {
            setIsLoading(true)
            try {
                const fetchedPengadaan = await axios.get(localAPIRoute + '/pengadaan', {
                    params: { id, detil: 'true' }
                })
                setPengadaan(fetchedPengadaan.data.pengadaan)
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchPengadaan()
    }, [id])

    useEffect(() => {
        const fetchDetilPengadaan = async () => {
            setIsLoading(true)
            try {
                let fetchedDetilPengadaan = await axios.post(localAPIRoute + '/pengadaan', {
                    id,
                    barang: 'true'
                })
                // [{}, {}, {},...]
                fetchedDetilPengadaan = fetchedDetilPengadaan.data.detailPengadaan[0] 
                fetchedDetilPengadaan = fetchedDetilPengadaan.map(detil=>{
                    const { jenis } = detil
                    let jenis_brg = '';
                    switch (jenis) {
                        case "D":
                            jenis_brg = 'Barang Dagang'
                            break;
                        case "B":
                            jenis_brg = 'Bahan Baku'
                            break;
                        case "A":
                            jenis_brg = 'Aset'
                            break;
                        default:
                            break;
                    }
                    return {...detil, jenis: jenis_brg}
                })
                setDetilPengadaan(fetchedDetilPengadaan)
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }

        if (pengadaan && pengadaan.idpengadaan) {
            fetchDetilPengadaan()
        }
    }, [pengadaan])

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
            navigate('/transaksi/pengadaan')
            alert('Sukses hapus Pengadaan #'+idPengadaan)
        }
    }

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2">Pengadaan</h1>
            {/* <Logger Object={penerimaan} />
            <Logger Object={detilPenerimaan} /> */}
            {/* <Logger Object={pengadaan} /> */}
            <div className="flex-1 bg-white p-5 rounded-lg shadow-md border border-gray-200 w-full my-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Pengadaan #{id}
                    </h2>
                    {pengadaan.status === 'N' && 
                        <a 
                            href=""
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-all flex items-center gap-2 mr-5"
                            onClick={e=>{
                                e.preventDefault()
                                if (confirm('Are You Sure??')) {
                                    handleDeletePengadaan(id)
                                }
                            }}
                        >
                            Hapus
                            <Trash2 size={18} />
                    </a>}
                </div>

                {!isLoading &&
                    <div className="bg-white p-4 shadow-sm text-sm">

                        {/* Header User & Vendor */}
                        <div className="grid grid-cols-4 gap-y-1">
                            <span className="font-medium">User</span>
                            <span className="col-span-3">{pengadaan.username}</span>

                            <span className="font-medium">Vendor</span>
                            <span className="col-span-3">{pengadaan.nama_vendor}</span>
                        </div>

                        <hr className="my-3 border-gray-300" />

                        {/* BASIC INFO */}
                        <div className="grid grid-cols-4 gap-y-2">
                            <span className="font-medium">ID Pengadaan</span>
                            <span className="col-span-3">{pengadaan.idpengadaan}</span>

                            <span className="font-medium">Waktu</span>
                            <span className="col-span-3">
                                {new Date(pengadaan.timestamp).toLocaleString("id-ID", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </span>

                            <span className="font-medium">Status</span>
                            <span className="col-span-3">
                                <span
                                    className={
                                        "text-xs font-semibold px-2 py-0.5 rounded-full " +
                                        (pengadaan.status === "N"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700")
                                    }
                                >
                                    {pengadaan.status === "N" ? "Diproses" : "Selesai"}
                                </span>
                            </span>
                        </div>

                        <hr className="my-3 border-gray-300" />

                        {/* INFORMASI NILAI */}
                        <h3 className="font-semibold text-gray-900 mb-2">Informasi Nilai</h3>

                        <div className="grid grid-cols-4 gap-y-2">
                            <span className="font-medium">Subtotal</span>
                            <span className="col-span-3 font-medium">
                                Rp {pengadaan.subtotal_nilai.toLocaleString("id-ID")}
                            </span>

                            <span className="font-medium">PPN</span>
                            <span className="col-span-3">{pengadaan.ppn}%</span>

                            <span className="font-medium">Total Nilai</span>
                            <span className="col-span-3 font-semibold text-gray-800">
                                Rp {pengadaan.total_nilai.toLocaleString("id-ID")}
                            </span>
                        </div>

                    </div>

                }



            </div>

            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* <Logger Object={detilPengadaan} /> */}

            {/* <DetilPenerimaanCards data={detilPenerimaan} /> */}
            <DetilPengadaanCards data={detilPengadaan} />
        </div>
    )
}

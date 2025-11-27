import { Trash2 } from "lucide-react";
import Logger from "../../../components/logger";

export default function PengadaanList({ data, link = "pengadaan", f }) {
    let data_mapped = []
    if (Array.isArray(data)) {
        data_mapped = data
    } else if (data) {
        data_mapped.push(data)
    }
    return (
        <div className="container mx-auto p-4">
            {/* <Logger Object={data_mapped} /> */}
            {data_mapped && data_mapped.length > 0 ?
                <div
                    className="flex flex-col gap-4 pr-2"
                >
                    {data_mapped.map((item) => (
                        <div
                            key={item.idpengadaan}
                            className="w-full flex rounded-lg shadow-md hover:shadow-lg transition p-4 pr-10 bg-white items-center"
                        >
                            <a
                                href={`/${link}/${item.idpengadaan}`}
                                className="block flex-1"
                            >
                                <h3 className="text-lg font-bold mb-2">
                                    Pengadaan: {item.idpengadaan}
                                </h3>

                                <p className="text-sm text-gray-700">
                                    Tanggal: {new Date(item.timestamp).toLocaleString()}
                                </p>

                                <p className='text-sm text-gray-700 w-fit p-2 rounded-md'>
                                    Status: <span className={' px-2 py-0.5 rounded-md ' + (item.status === "N" ? ' text-red-600 bg-red-200' : ' text-green-800 bg-green-200 ')}>{item.status === "N" ? "Diproses" : "Selesai"}</span>
                                </p>

                                <p className="text-sm text-gray-700">
                                    Total Nilai: Rp {item.total_nilai.toLocaleString("id-ID")}
                                </p>
                            </a>
                            {link == 'pengadaan' && item.status === 'N' && 
                            <a 
                                href=""
                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-all"
                                onClick={e=>{
                                    e.preventDefault()
                                    if (confirm('Are You Sure??')) {
                                        f.deletePengadaan(item.idpengadaan)
                                    }
                                }}
                            >
                                <Trash2 size={18} />
                            </a>}
                        </div>
                    ))}
                </div>
                :
                <span>Data tidak ditemukan</span>
            }
        </div>
    );
}

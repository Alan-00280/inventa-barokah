import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Logger from "../../../components/logger";


export default function DetilPengadaanCards({ data }) {
    // const [defaultData, setDefaultData] = useState([]);

    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState(null);
    
    //? Mock Data ?//
    // const data = [{ "iddetail_pengadaan": 26, "harga_satuan": 20000, "jumlah": 20, "sub_total": 400000, "idbarang": 2, "idpengadaan": 25, "jenis": "D", "nama": "Minyak Goreng Botol", "status": 1, "harga": 20000, "idsatuan": 3, "nama_satuan": "Liter" }, { "iddetail_pengadaan": 27, "harga_satuan": 65000, "jumlah": 10, "sub_total": 650000, "idbarang": 1, "idpengadaan": 25, "jenis": "D", "nama": "Beras Premium", "status": 1, "harga": 65000, "idsatuan": 4, "nama_satuan": "Kg" }]

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6 my-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Detail Pengadaan
            </h2>

            {/* <Logger Object={data} /> */}

            {/* {isLoading && <p className="text-gray-500">Loading . . .</p>} */}

            {data && data.map((item) => (
                <div
                    key={item.iddetail_pengadaan}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                >
                    <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900">
                            {item.nama}
                            <span
                            className={`inline-block text-xs font-medium px-3 py-1 rounded-full mx-3 ${item.status === 1
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {item.status === 1 ? 'Aktif' : 'Nonaktif'}
                        </span>
                        </h3> 
                        <p className="text-xs text-gray-500">
                            {item.jenis}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="col-span-1">
                            <span className="block text-gray-500">Harga Satuan</span>
                            <span className="block text-base font-semibold text-green-700">
                                Rp {item.harga_satuan.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="col-span-1">
                            <span className="block text-gray-500">Jumlah</span>
                            <span className="block text-base font-semibold text-blue-700">
                                {item.jumlah.toLocaleString('id-ID')} {item.nama_satuan}
                            </span>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <span className="block text-gray-500">Sub Total</span>
                            <span className="block text-lg font-bold text-gray-900">
                                Rp {item.sub_total.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>


    )
}

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Logger from "../../../components/logger";


export default function DetilPenerimaanCards({ data }) {
    const [defaultData, setDefaultData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setDefaultData(data);
        setIsLoading(false);
    }, [data])

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6 my-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Detail
            </h2>

            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* ? Card Nya ? */}
            {!isLoading && defaultData.map((item) => (
                <div
                    key={item.iddetail_penerimaan}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition text-sm text-gray-700 space-y-1"
                >
                    <div className="grid grid-cols-4 gap-y-1">
                        <span className="font-medium">Nama Barang</span>
                        <span className="col-span-3 font-semibold text-gray-900">{item.nama}</span>

                        <span className="font-medium">Jenis</span>
                        <span className="col-span-3">
                            {item.jenis === 'D' ? 'Digunakan' : 'Bahan / Barang Penunjang'}
                        </span>

                        <span className="font-medium">Jumlah Terima</span>
                        <span className="col-span-3">{item.jumlah_terima.toLocaleString('id-ID')} unit</span>

                        <span className="font-medium">Harga Satuan</span>
                        <span className="col-span-3">Rp {item.harga_satuan_terima.toLocaleString('id-ID')}</span>

                        <span className="font-medium">Sub Total</span>
                        <span className="col-span-3 font-semibold text-gray-900">
                            Rp {item.sub_total_terima.toLocaleString('id-ID')}
                        </span>

                        <span className="font-medium">Status Barang</span>
                        <span className={`col-span-3 font-medium ${item.status === 1 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.status === 1 ? 'Aktif' : 'Nonaktif'}
                        </span>

                        <span className="font-medium">ID Barang</span>
                        <span className="col-span-3">{item.idbarang}</span>

                        <span className="font-medium">ID Detail Penerimaan</span>
                        <span className="col-span-3">{item.iddetail_penerimaan}</span>
                    </div>
                </div>
            ))}

        </div>
    )
}

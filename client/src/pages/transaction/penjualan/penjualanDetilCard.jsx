

export default function PenjualanDetilCard({ data, ...props }) {
    const formatRupiah = (num) =>
        num.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

    return (
        <div
            className="w-full p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 my-3"
            {...props}
        >
            {/* NAMA BARANG */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {data.nama}
                    </h3>
                    <p className="text-sm text-gray-500">({data.satuan})</p>
                </div>

                <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                    ID #{data.iddetail_penjualan}
                </span>
            </div>

            {/* DETAIL NILAI */}
            <div className="flex justify-between py-1">
                <span className="text-sm text-gray-600">Harga Satuan</span>
                <span className="font-medium">{formatRupiah(data.harga_satuan)}</span>
            </div>

            <div className="flex justify-between py-1">
                <span className="text-sm text-gray-600">Jumlah</span>
                <span className="font-medium">{data.jumlah}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-t mt-2 border-gray-300">
                <span className="text-base font-semibold text-gray-700">Subtotal</span>
                <span className="text-lg font-bold text-blue-700">
                    {formatRupiah(data.subtotal)}
                </span>
            </div>
        </div>
    );
}





export default function PenjualanCard({ ...props }) {
    const data = props.data;

    const formatRupiah = (num) =>
        num.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

    const formatTanggal = (str) =>
        new Date(str).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        });

    return (
        <div
            className="w-full p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200 my-5"
            {...props}
        >
            {/* ID + WAKTU */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    Penjualan #{data.idpenjualan}
                </h2>
                <span className="text-xs text-gray-500">
                    {formatTanggal(data.waktu)}
                </span>
            </div>

            {/* USER */}
            <div className="mb-3">
                <p className="text-sm text-gray-600">User:</p>
                <p className="font-semibold text-blue-600">{data.username}</p>
            </div>

            {/* TOTAL NILAI */}
            <div className="flex justify-between items-center py-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="font-medium">{formatRupiah(data.subtotal_nilai)}</span>
            </div>

            <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">PPN ({data.ppn}%)</span>
                <span className="font-medium text-yellow-600">
                    {formatRupiah((data.subtotal_nilai * data.ppn) / 100)}
                </span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-300 mt-2">
                <span className="text-base font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold text-green-700">
                    {formatRupiah(data.total_nilai)}
                </span>
            </div>
        </div>
    );
}
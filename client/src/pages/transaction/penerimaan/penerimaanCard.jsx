


export default function PenerimaanCard({data, link = 'penerimaan' }) {



    return (
        <div className="container mx-auto p-4">
            {data.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((item) => (
                        <a
                            key={item.idpenerimaan}
                            href={`/${link}/${item.idpenerimaan}`}
                            className="block rounded-xl shadow-md hover:shadow-lg transition bg-white p-5 border border-gray-100 hover:border-blue-300"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    ID Penerimaan #{item.idpenerimaan}
                                </h3>
                                <span
                                    className={
                                        "text-xs font-medium px-3 py-1 rounded-full " +
                                        (item.status === "N"
                                            ? "bg-green-100 text-green-700 "
                                            : "bg-red-100 text-red-700")
                                    }
                                >
                                    {item.status === "N" ? "Selesai" : "Diproses"}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">ID Pengadaan:</span>{" "}
                                {item.idpengadaan}
                            </p>

                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">User:</span>{" "}
                                {item.username} (ID: {item.iduser})
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium text-gray-700">Tanggal:</span>{" "}
                                {new Date(item.created_at).toLocaleString("id-ID", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </p>


                            <div className="mt-3 text-right flex justify-between">
                                <span className="text-blue-600 text-sm font-medium hover:underline">
                                    Lihat detail →
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 italic">
                    Data tidak ditemukan
                </div>
            )}
        </div>
    );
}

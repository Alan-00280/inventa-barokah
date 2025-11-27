import { use, useEffect, useRef, useState } from "react"
import KonfirmasiPenerimaan from "./penerimaanKonfirmasiCard";
import Logger from "../../../components/logger";


export default function TerimaPengadaanCard({ data, ppn, vendorID, pengadaanID, status, dataPenerimaan }) {
    let defaultData = useRef([]);

    const [confirmedData, setConfirmedData] = useState([]);
    const [changed, setChanged] = useState([]);
    const [subTotalNilai, setSubTotalNilai] = useState(0);
    const [isStatus, setIsStatus] = useState(status == "N")
    const [warning, setWarning] = useState([])
    const [telahDiterima, setTelahDiterima] = useState([])
    const [valid, setValid] = useState(true)
    const [pengadaanDone, setPengadaanDone] = useState(true)


    useEffect(() => {
        setIsStatus(status == "N")
    }, [status])

    // Set default data
    useEffect(() => {
        defaultData.current = data;
        setTelahDiterima(
            data.map(diterima => {
                let telahDiterima = 0
                dataPenerimaan.filter(i => i.barang_idbarang == diterima.idbarang).forEach(i => telahDiterima += i.jumlah_terima)
                return { id: diterima.iddetail_pengadaan, diterima: telahDiterima }
            })
        )
    }, [data, dataPenerimaan])

    useEffect(() => {
        setConfirmedData(defaultData.current.map(i => {
            const diterima = telahDiterima.find(j => j.id == i.iddetail_pengadaan)?.diterima
            return { ...i, jumlah: i.jumlah - diterima }
        }));

        setChanged(data.map(i => ({ id: i.iddetail_pengadaan, changed: false })));

        setWarning(data.map(i => ({ id: i.iddetail_pengadaan, warning_jumlah: false, err_jumlah: false })));

        data.map(i => {
            setSubTotalNilai(prev => prev + i.harga_satuan * i.jumlah)
        })
    }, [data, telahDiterima])

    useEffect(() => {
        let newSubTotal = 0
        confirmedData.forEach(i => { newSubTotal += Number(i.harga_satuan) * Number(i.jumlah) })
        setSubTotalNilai(newSubTotal)
        
        const isPengadaanDone = confirmedData.some(item=>{
            const defdata = defaultData.current.find(def=>def.iddetail_pengadaan == item.iddetail_pengadaan)
            const diterima = telahDiterima.find(terima=>terima.id == item.iddetail_pengadaan)?.diterima
            return (Number(item.jumlah) + diterima) < defdata.jumlah
        })
        setPengadaanDone(!isPengadaanDone)
    }, [confirmedData])

    useEffect(() => {
        const hasError = warning.some(w => w.err_jumlah);
        setValid(!hasError);
    }, [warning]);

    const handleForm = (id, field, value) => {
        setConfirmedData(prev => prev.map(
            item => (
                item.iddetail_pengadaan == id ?
                    { ...item, [field]: value }
                    : item
            )
        ))
        setChanged(prev => prev.map(
            i => (
                i.id == id ? { ...i, changed: true } : i
            )
        ))
        if (field == 'jumlah') {
            setWarning(prev => prev.map(
                i => {
                    const diterima = telahDiterima.find(j => j.id == id)?.diterima
                    const pengadaan = defaultData.current.find(j => j.iddetail_pengadaan == id)?.jumlah
                    const test = (Number(value) + diterima) > pengadaan
                    // console.log(diterima, pengadaan, value)
                    return (i.id == id) ? ((test) ? { ...i, warning_jumlah: true } : { ...i, warning_jumlah: false }) : i
                }
            ))
        }
        if (field == 'jumlah') {
            setWarning(prev => prev.map(
                i => {
                    const test = (Number(value) < 0)
                    return (i.id == id) ? ((test) ? { ...i, err_jumlah: true } : { ...i, err_jumlah: false }) : i
                }
            ))
        }

    }
    const resetValue = (id) => {
        const defData = defaultData.current.find(item => item.iddetail_pengadaan == id)
        setConfirmedData(prev => prev.map(
            item => {
                const diterima = telahDiterima.find(i => i.id == id)?.diterima
                return item.iddetail_pengadaan == id ?
                    { ...defData, jumlah: defData.jumlah - diterima }
                    : item
            }
        ))
        setChanged(prev => prev.map(
            i => (
                i.id == id ? { ...i, changed: false } : i
            )
        ))
        setWarning(prev => prev.map(
            i => (
                i.id == id ? { ...i, warning_jumlah: false, err_jumlah: false } : i
            )
        ))
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6 my-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Konfirmasi Detail Pengadaan
            </h2>

            <div
                id="form-details"
                className="space-y-4 max-h-96 overflow-y-auto pr-2"
            >
                {confirmedData.map((confirmed) => {
                    const isChanged = changed.find(
                        (i) => i.id == confirmed.iddetail_pengadaan
                    )?.changed;

                    const diterima = telahDiterima.find(
                        (i) => i.id == confirmed.iddetail_pengadaan
                    )?.diterima;

                    const isWarningJumlah = warning.find(
                        (i) => i.id == confirmed.iddetail_pengadaan
                    )?.warning_jumlah;

                    const isErrJumlah = warning.find(
                        (i) => i.id == confirmed.iddetail_pengadaan
                    )?.err_jumlah;

                    const pengadaan = defaultData.current.find(
                        (i) => i.iddetail_pengadaan == confirmed.iddetail_pengadaan
                    );

                    return (
                        <div
                            key={confirmed.iddetail_pengadaan}
                            className="grid grid-cols-12 gap-3 items-center bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition"
                            id="form-konfirmasi"
                        >
                            {/* Nama barang */}
                            <div className="col-span-3">
                                <span className="font-semibold text-gray-800">
                                    {confirmed.nama}
                                    {isChanged && <span className="text-red-500 ml-1">*</span>}
                                </span>
                            </div>

                            {/* Info pengadaan */}
                            <div className="col-span-9 grid grid-cols-3 text-sm text-gray-700 gap-y-1">
                                <span>Pengadaan Awal: {pengadaan.jumlah}</span>
                                <span>
                                    Harga Satuan: Rp{" "}
                                    {pengadaan.harga_satuan.toLocaleString("id-ID")}
                                </span>
                                <span>Telah Diterima: {diterima}</span>
                            </div>

                            {/* Harga terima */}
                            <div className="col-span-12 flex flex-wrap items-center gap-2 mt-2">
                                <span className="text-sm text-gray-600 font-bold">
                                    Harga Terima:
                                </span>
                                <input
                                    disabled={!isStatus}
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    name="harga_satuan"
                                    className={`w-24 px-2 py-1 border rounded-md text-sm ${!isStatus ? "bg-gray-100 cursor-not-allowed" : ""
                                        }`}
                                    value={confirmed.harga_satuan}
                                    onChange={(e) =>
                                        handleForm(
                                            confirmed.iddetail_pengadaan,
                                            "harga_satuan",
                                            e.target.value
                                        )
                                    }
                                />
                                <span className="text-sm text-gray-600">
                                    /{confirmed.nama_satuan}
                                </span>
                            </div>

                            {/* Input jumlah terima */}
                            <div className="col-span-12 flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600 font-bold">
                                    Diterima Sekarang:
                                </span>
                                {/* <Logger Object={confirmed} /> */}
                                <input
                                    disabled={!isStatus}
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    name="jumlah"
                                    className={`w-20 px-2 py-1 border rounded-md text-sm ${!isStatus ? "bg-gray-100 cursor-not-allowed" : ""
                                        }`}
                                    min="0"
                                    value={String(confirmed.jumlah)}
                                    onChange={(e) =>
                                        handleForm(
                                            confirmed.iddetail_pengadaan,
                                            "jumlah",
                                            e.target.value
                                        )
                                    }
                                />
                                <span className="text-sm text-gray-600">
                                    {confirmed.nama_satuan}
                                </span>

                                {/* Warning dan error */}
                                {isWarningJumlah && (
                                    <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-md">
                                        ⚠️ Jumlah melebihi pengadaan!
                                    </span>
                                )}
                                {isErrJumlah && (
                                    <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                                        ❌ Jumlah tidak boleh negatif!
                                    </span>
                                )}
                            </div>

                            {/* Subtotal & reset */}
                            <div className="col-span-12 flex justify-between items-center mt-2">
                                <span className="text-sm font-medium text-gray-800">
                                    Subtotal:{" "}
                                    <span className="font-semibold text-green-700">
                                        Rp{" "}
                                        {(
                                            confirmed.harga_satuan * confirmed.jumlah
                                        )?.toLocaleString("id-ID")}
                                    </span>
                                </span>

                                {isStatus && (
                                    <button
                                        onClick={() => resetValue(confirmed.iddetail_pengadaan)}
                                        className="text-xs bg-red-500 text-white py-1 px-3 rounded-md transition-all duration-150 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ringkasan penerimaan */}
            <KonfirmasiPenerimaan
                data={{
                    subtotal_nilai: subTotalNilai,
                    ppn: ppn,
                    confirmed: confirmedData,
                    vendorID: vendorID,
                    pengadaanID: pengadaanID,
                    userID: "101",
                    status: isStatus,
                    valid: valid,
                    pengadaanDone: pengadaanDone
                }}
            />
        </div>
    );
}
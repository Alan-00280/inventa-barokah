import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { isValidElement, useEffect, useState } from "react"
import Logger from "../../../components/logger"
import axios from "axios"
import localAPIRoute from "../../../constant/APIRoute"
import SubmitButtonPenjualan from "./submitPenjualan"

export default function PenjualanCreate() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(undefined)
    const [metaPenjualan, setMetaPenjualan] = useState({
        id_user: 104,
        username: 'admin003',
        margin: null
    })
    const [detilPenjualan, setDetilPenjualan] = useState([
        { brg_id: '', jumlah: 0, harga: 0, total: 0, stok: 0 }
    ])

    //? fetch margin aktif ?//
    useEffect(() => {
        const fetchMargin = async () => {
            const fetchedMargin = await axios.get(localAPIRoute + '/penjualan/margin', {
                data: {
                    all: 'false'
                }
            })
            setMetaPenjualan(prev => ({ ...prev, margin: parseInt(fetchedMargin.data.margin[0].persen) }))
        }
        fetchMargin()
    }, [])

    //? fetch data barang ?//
    const [barang, setBarang] = useState([])
    useEffect(() => {
        const fetchBarang = async () => {
            setIsLoading(true)
            try {
                let fetchedBarang = await axios.get(localAPIRoute + '/barang/with-stok')
                fetchedBarang = fetchedBarang.data.barang[0]
                fetchedBarang = fetchedBarang.map((i) => (
                    {
                        ...i,
                        picked: false
                    }
                ))
                setBarang(fetchedBarang)
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBarang()
    }, [])

    //TODO get IDs id Barang inside detilPenjualan
    const selectedBarangIDs = detilPenjualan.filter(b => b.brg_id !== '').map(b => b.brg_id)

    //TODO Validations //
    const isCardComplete = (card) => {
        return (card.brg_id !== '' && card.jumlah > 0 && card.jumlah <= card.stok)
    }
    const allCardComplete = detilPenjualan.every(b => isCardComplete(b)) // true or false

    const isCardJumlahValid = (card) => {
        return (card.jumlah <= card.stok)
    }

    const isFormDone = () => {
        return (
            allCardComplete &&
            detilPenjualan.length > 0
        )
    }

    //TODO onChange handler//
    const handleInputChange = (index, field, value) => {
        setDetilPenjualan(prev => {
            let updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }

            // update barang -> update harga -> total && set stok
            if (field == 'brg_id') {
                const selectedBrg = barang.find(b => b.idbarang === parseInt(value))

                let hargaNew = (selectedBrg)?.harga || 0
                hargaNew = hargaNew + hargaNew * (metaPenjualan.margin / 100)
                updated[index].harga = hargaNew
                updated[index].total = hargaNew * updated[index].jumlah

                updated[index].stok = (selectedBrg)?.stok || 0
            }

            // update jumlah -> update total
            if (field == 'jumlah') {
                if (parseInt(value) > updated[index].stok) {
                    // handle jumlah input melebihi stok
                } else {
                    updated[index].jumlah = parseInt(value) || 0
                    updated[index].total = updated[index].jumlah * updated[index].harga
                }
            }

            return updated
        })
    }

    //TODO add New Card
    const addCardForm = () => {
        if (allCardComplete) {
            setDetilPenjualan(
                prev => ([...prev, { brg_id: '', jumlah: 0, harga: 0, total: 0, stok: 0 }])
            )
        }
    }

    //TODO Remove | Reset Card
    const removeCard = (index) => {
        if (detilPenjualan.length <= 1) {
            setDetilPenjualan([{ brg_id: '', jumlah: 0, harga: 0, total: 0, stok: 0 }])
        } else {
            setDetilPenjualan(prev => (
                prev.filter((detil, i) => i !== index)
            ))
        }
    }

    //TODO calculate total subtotal
    const subTotal = detilPenjualan.reduce((acc, curr) => { return acc + curr.total }, 0)
    const [ppn, setPpn] = useState(10) 
    const ppnTotal = (10/100) * subTotal
    const total = ppnTotal + subTotal


    return (
        <div className="p-6 font-sans max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Buat Penjualan</h1>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 w-full text-gray-800 space-y-4 my-5">
                <div className="grid grid-cols-2 gap-y-3 w-1/4">
                    <span className="text-sm font-medium text-gray-700">User</span>
                    <span className="text-base font-semibold text-blue-700">
                        : {metaPenjualan.username}
                    </span>

                    <span className="text-sm font-medium text-gray-700">Margin</span>
                    <span className="text-base font-semibold text-blue-700">
                        : {metaPenjualan.margin} %
                    </span>
                </div>

            </div>

            {/* <Logger Object={allCardComplete} /> */}

            {/* Detail Pengadaan Cards */}
            <div className="space-y-4">
                {detilPenjualan.map((item, index) => {
                    const cardComplete = isCardComplete(item); //isCardComplete(item);

                    return (

                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${cardComplete ? "ring-2 ring-green-400" : "border border-gray-200"
                                }`}
                        >
                            {/* Header */}
                            <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 flex items-center justify-between">
                                <span className="text-white font-semibold text-sm">Item #{index + 1}</span>
                                {cardComplete && (
                                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        ✓ Lengkap
                                    </span>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                                    {/* Pilih Barang */}
                                    <div className="md:col-span-5">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Barang <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${item.brg_id === ""
                                                    ? "border-gray-300 focus:ring-blue-500"
                                                    : "border-green-500 focus:ring-green-500 bg-green-50"
                                                }`}
                                            value={item.brg_id}
                                            onChange={(e) => handleInputChange(index, 'brg_id', e.target.value)}
                                        >
                                            <option value="">-- Pilih Barang --</option>
                                            {barang.filter(
                                                brg => !selectedBarangIDs.includes(String(brg.idbarang)) || parseInt(item.brg_id) == brg.idbarang
                                            ).map(b => (
                                                <option key={b.idbarang} value={b.idbarang} disabled={b.stok <= 0} >{b.nama} {b.stok <= 0 && ' (Habis)'}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Stok: <span className="font-semibold">{item.stok}</span>
                                        </p>
                                    </div>

                                    {/* Jumlah */}
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Jumlah Jual <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                onWheel={(e) => e.target.blur()}
                                                min="1"
                                                className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${item.jumlah > 0
                                                        ? "border-green-500 focus:ring-green-500 bg-green-50"
                                                        : "border-gray-300 focus:ring-blue-500"
                                                    }`}
                                                placeholder="0"
                                                value={item.jumlah || ""}
                                                onChange={(e) => handleInputChange(index, 'jumlah', e.target.value)}
                                            />
                                            <span className="text-sm font-medium text-gray-600 min-w-[35px]">
                                                {barang.find(b => b.idbarang === parseInt(item.brg_id))?.satuan || "-"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Harga Satuan */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Harga Satuan
                                        </label>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                                            <span className="text-sm font-bold text-blue-700">
                                                Rp {item.harga.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Subtotal
                                        </label>
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
                                            <span className="text-sm font-bold text-indigo-700">
                                                Rp {item.total.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-4 py-2 flex justify-end border-t border-gray-100">
                                <button
                                    onClick={() => removeCard(index)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                                    title={detilPenjualan.length === 1 ? "Reset form" : "Hapus barang"}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {detilPenjualan.length === 1 ? "Reset" : "Hapus"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Button */}
            <div className="flex items-center gap-3 mt-4">
                <button
                    onClick={addCardForm}
                    disabled={!allCardComplete}
                    className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-lg shadow-sm transition ${allCardComplete
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Barang</span>
                </button>

                {(
                    !detilPenjualan.every(b => isCardComplete(b)) && detilPenjualan.every(b => isCardJumlahValid(b))
                ) && (
                        <div className="flex items-center gap-2 text-amber-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Lengkapi form yang ada sebelum menambah barang baru</span>
                        </div>
                    )}

                {!(
                    detilPenjualan.every(b => isCardJumlahValid(b))
                ) && (
                        <div className="flex items-center gap-2 text-amber-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Jumlah melebihi Stok</span>
                        </div>
                    )}
            </div>


            {/* Total Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 w-full text-gray-800 space-y-4 my-5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Sub Total:</span>
                        <span className="text-base font-semibold text-blue-700">
                            Rp {subTotal.toLocaleString('id-ID')}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">ppnTotal ({ppn}%):</span>
                        <span className="text-base font-semibold text-blue-700">
                            Rp {ppnTotal.toLocaleString('id-ID')}
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2 mt-2">
                        <span className="text-sm font-bold text-gray-800">Total:</span>
                        <span className="text-lg font-bold text-blue-800">
                            Rp {total.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Form */}
            <SubmitButtonPenjualan 
                isFormDone={isFormDone} 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setError={setError} 
                data={
                {
                    'metaPenjualan': metaPenjualan,
                    'detilPenjualan': detilPenjualan
                }
            } />

            {/* Validation Alert */}
            {!isFormDone() && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Form Tidak Valid:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {!detilPenjualan.every(b => isCardComplete(b)) && detilPenjualan.every(b => isCardJumlahValid(b)) && <li>Lengkapi semua detail barang (pilih barang dan isi jumlah)</li>}
                            {detilPenjualan.length <= 0 && <li>Belum Ada Detail Penjualan</li>}
                            {!(detilPenjualan.every(b => isCardJumlahValid(b))) && <li>Terdapat jumlah yang melebihi Stok</li>}
                        </ul>
                    </div>
                </div>
            )}

            {/* <Logger Object={barang} /> */}
            {/* <Logger Object={selectedBarangIDs} /> */}
        </div>
    )

}

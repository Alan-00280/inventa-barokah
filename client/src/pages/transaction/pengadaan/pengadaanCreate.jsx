import axios from "axios";
import { useEffect, useState } from "react";
import localAPIRoute from "../../../constant/APIRoute";
import Logger from "../../../components/logger";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";


export default function PengadaanCreate() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metaPengadaan, setMetaPengadaan] = useState({
        vendor_id: "",
        user_id: 103
    });
    const [detilPengadaan, setDetilPengadaan] = useState([
        { brg_id: "", jumlah: 0, harga: 0, total: 0 }
    ]);

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

    //? fetch data vendor ?//
    const [vendor, setVendor] = useState([])
    useEffect(() => {
        const fetchVendor = async () => {
            setIsLoading(true)
            try {
                const fetchedVendor = await axios.get(localAPIRoute + '/barang/vendor')
                setVendor(fetchedVendor.data.vendor[0])
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVendor()
    }, [])

    // Get list of selected barang IDs
    const selectedBarangIds = detilPengadaan
        .map(item => item.brg_id)
        .filter(id => id !== "");

    // Validate if card is complete (barang selected and jumlah > 0)
    const isCardComplete = (card) => {
        return card.brg_id !== "" && card.jumlah > 0;
    };

    // Check if all cards are complete
    const allCardsComplete = detilPengadaan.every(isCardComplete);

    // Calculate subtotal
    const subTotal = detilPengadaan.reduce((sum, item) => sum + item.total, 0);
    const ppn = subTotal * 0.1;
    const grandTotal = subTotal + ppn;

    // Validate form before submit
    const isFormValid = () => {
        return (
            metaPengadaan.vendor_id !== "" &&
            detilPengadaan.length > 0 &&
            allCardsComplete
        );
    };

    const handleFormMeta = (value) => {
        setMetaPengadaan(prev => ({
            ...prev,
            vendor_id: value
        }));
    };

    const handleChangeFormDetil = (index, field, value) => {
        setDetilPengadaan(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };

            // If barang changed, update harga and recalculate total
            if (field === 'brg_id') {
                const selectedBarang = barang.find(b => b.idbarang === parseInt(value));
                updated[index].harga = selectedBarang ? selectedBarang.harga : 0;
                updated[index].total = updated[index].jumlah * updated[index].harga;
            }

            // If jumlah changed, recalculate total
            if (field === 'jumlah') {
                const jumlah = parseInt(value) || 0;
                updated[index].jumlah = jumlah;
                updated[index].total = jumlah * updated[index].harga;
            }

            return updated;
        });
    };

    const addCardFormDetil = () => {
        // Only allow adding if all current cards are complete
        if (allCardsComplete) {
            setDetilPengadaan(prev => [
                ...prev,
                { brg_id: "", jumlah: 0, harga: 0, total: 0 }
            ]);
        }
    };

    const removeCardFormDetil = (index) => {
        if (detilPengadaan.length === 1) {
            // If only one card, reset it instead of removing
            setDetilPengadaan([{ brg_id: "", jumlah: 0, harga: 0, total: 0 }]);
        } else {
            // Remove the card at index
            setDetilPengadaan(prev => prev.filter((_, i) => i !== index));
        }
    };

    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (!isFormValid()) {
            alert("Mohon lengkapi semua data sebelum submit!");
            return;
        }

        try {
            setIsLoading(true);

            // Prepare data according to backend format
            // Backend expects: { user_id, vendor_id, 0: {...}, 1: {...}, ... }
            const items = detilPengadaan.map(item => ({
                    brg_id: item.brg_id,
                    jumlah: item.jumlah
                }))
            const dataToSend = {
                user_id: metaPengadaan.user_id,
                vendor_id: parseInt(metaPengadaan.vendor_id),
                items: items
            };

            // Uncomment when ready to use actual API

            const response = await axios.post(
                localAPIRoute + '/pengadaan/create',
                dataToSend
            );

            if (response.data.success === 'true') {
                alert("Pengadaan berhasil dibuat!");
                navigate('/transaksi/pengadaan')
            }


            // alert("Data siap dikirim! (Lihat console untuk data)");

        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat menyimpan data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 font-sans max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Buat Pengadaan</h1>

            {/* User & Vendor Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 w-full text-gray-800 space-y-4 my-5">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">User:</span>
                        <span className="text-base font-semibold text-blue-700">admin 2</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                            Vendor: <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="vendor"
                            name="vendor"
                            className={`border rounded-lg px-3 py-2 w-2/3 text-sm focus:ring-2 focus:outline-none text-gray-700 ${metaPengadaan.vendor_id === ""
                                ? "border-gray-300 focus:ring-blue-500"
                                : "border-green-500 focus:ring-green-500"
                                }`}
                            onChange={(e) => handleFormMeta(e.target.value)}
                            value={metaPengadaan.vendor_id}
                        >
                            <option value="">-- Pilih Vendor --</option>
                            {vendor.map((v) => (
                                <option value={v.idvendor} key={v.idvendor}>
                                    {v.nama_vendor}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Add Button */}
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={addCardFormDetil}
                    disabled={!allCardsComplete}
                    className={`inline-flex items-center gap-2 font-medium px-4 py-2 rounded-lg shadow-sm transition ${allCardsComplete
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Barang</span>
                </button>
                {!allCardsComplete && (
                    <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>Lengkapi form yang ada sebelum menambah barang baru</span>
                    </div>
                )}
            </div>

            {/* Detail Pengadaan Cards */}
            <div className="space-y-4">
                {detilPengadaan.map((item, index) => {
                    const cardComplete = isCardComplete(item);

                    return (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border rounded-xl shadow-sm p-4 text-gray-700 ${cardComplete ? "border-green-300" : "border-gray-200"
                                }`}
                        >
                            {/* Pilih Barang */}
                            <div className="flex flex-col w-full md:w-1/3">
                                <label className="text-sm font-medium text-gray-800 mb-1">
                                    Barang <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${item.brg_id === ""
                                        ? "border-gray-300 focus:ring-blue-500"
                                        : "border-green-500 focus:ring-green-500"
                                        }`}
                                    value={item.brg_id}
                                    onChange={(e) => handleChangeFormDetil(index, 'brg_id', e.target.value)}
                                >
                                    <option value="">-- Pilih Barang --</option>
                                    {barang
                                        .filter(b => !selectedBarangIds.includes(String(b.idbarang)) || b.idbarang === parseInt(item.brg_id))
                                        .map((b) => (
                                            <option key={b.idbarang} value={b.idbarang}>
                                                {b.nama}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Input Jumlah */}
                            <div className="flex flex-col w-fit md:w-1/6">
                                <label className="text-sm font-medium text-gray-800 mb-1">
                                    Jumlah <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        min="1"
                                        className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none flex-1 w-5 ${item.jumlah > 0
                                                ? "border-green-500 focus:ring-green-500"
                                                : "border-gray-300 focus:ring-blue-500"
                                            }`}
                                        placeholder="0"
                                        value={item.jumlah || ""}
                                        onChange={(e) => handleChangeFormDetil(index, 'jumlah', e.target.value)}
                                    />
                                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                        {barang.find(b => b.idbarang === parseInt(item.brg_id))?.satuan || "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Harga Satuan */}
                            <div className="flex flex-col w-full md:w-1/5">
                                <label className="text-sm font-medium text-gray-800 mb-1">Harga Satuan</label>
                                <span className="text-base font-semibold text-blue-700">
                                    Rp {item.harga.toLocaleString('id-ID')}
                                </span>
                            </div>

                            {/* Subtotal */}
                            <div className="flex flex-col w-full md:w-1/5">
                                <label className="text-sm font-medium text-gray-800 mb-1">Subtotal</label>
                                <span className="text-base font-bold text-blue-800">
                                    Rp {item.total.toLocaleString('id-ID')}
                                </span>
                            </div>

                            {/* Delete Button */}
                            <div className="flex items-end h-full">
                                <button
                                    onClick={() => removeCardFormDetil(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title={detilPengadaan.length === 1 ? "Reset form" : "Hapus barang"}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
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
                        <span className="text-sm font-medium text-gray-700">PPN (10%):</span>
                        <span className="text-base font-semibold text-blue-700">
                            Rp {ppn.toLocaleString('id-ID')}
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2 mt-2">
                        <span className="text-sm font-bold text-gray-800">Total:</span>
                        <span className="text-lg font-bold text-blue-800">
                            Rp {grandTotal.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                    className={`flex-1 font-medium px-6 py-3 rounded-lg transition ${isFormValid() && !isLoading
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {isLoading ? "Menyimpan..." : "Simpan Pengadaan"}
                </button>
                <button
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                    Batal
                </button>
            </div>

            {/* Validation Alert */}
            {!isFormValid() && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Form belum lengkap:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {metaPengadaan.vendor_id === "" && <li>Pilih vendor</li>}
                            {!allCardsComplete && <li>Lengkapi semua detail barang (pilih barang dan isi jumlah)</li>}
                        </ul>
                    </div>
                </div>
            )}
            {/* <Logger Object={barang} /> */}
        </div>
    );
}

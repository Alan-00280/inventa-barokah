import axios from "axios";
import Logger from "../../../components/logger";
import localAPIRoute from "../../../constant/APIRoute";
import { useNavigate } from "react-router";



export default function SubmitButtonPenjualan({ data={metaPenjualan:{}, detilPenjualan:[]}, isFormDone, isLoading, setIsLoading, setError }) {

    const navigate = useNavigate()
    
    const handleSubmitPenjualan = async () => {
        if (isFormDone) {
            try {
                setIsLoading(true)
                const postPDetilPenjualan = await axios.post(localAPIRoute+'/penjualan', {
                    metaPenjualan: data.metaPenjualan,
                    detilPenjualan: data.detilPenjualan
                })
                if (postPDetilPenjualan.data.success) {
                    // alert('Berhasil menambahkan penjualan')
                    navigate('/transaksi/penjualan', { state: { message: 'Berhasil Menambahkan!' }})
                } 
            } catch (error) {
                setError(error)
                alert('Error: '+JSON.stringify(error))
            } finally {
                setIsLoading(false)
            }
        } else {
            return alert('isFormDone false!')
        }
    }

    return (
    <div className="flex gap-3">
        <button
            onClick={handleSubmitPenjualan}
            disabled={!isFormDone() || isLoading}
            className={`flex-1 font-medium px-6 py-3 rounded-lg transition ${isFormDone() && !isLoading
                ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
        >
            {isLoading ? "Menyimpan..." : "Tambah Penjualan"}
        </button>
        <button
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
            Batal
        </button>
        
        {/* <div className="flex-col w-1/4">
            <Logger Object={data.metaPenjualan} />
            <Logger Object={data.detilPenjualan} />
        </div> */}
    </div>
    )
}

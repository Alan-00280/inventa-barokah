import axios from "axios";
import { useEffect, useState } from "react";
import localAPIRoute from "../../constant/APIRoute";
import { ChevronDown } from "lucide-react";
import { data } from "react-router";

export default function MasterDataVendor() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [vendorData, setVendorData] = useState([]);
    const [activeOnly, setActiveOnly] = useState(true);

    const formatDataVendor = (res) => {
        let dataVendorRaw = res.data.vendor[0]
        
        dataVendorRaw = dataVendorRaw.map((vendor) => {
            const badanHukum = (vendor.badan_hukum === 'A') ? 'Badan Hukum Resmi' : 'Tidak Berbadan Hukum'
            const status = (vendor.status === 'A') ? 'Aktif' : 'Tidak Aktif'

            return {...vendor,
                    'badan_hukum': badanHukum,
                    'status': status
                }
        })
        
        return dataVendorRaw
    }

    const handleActive = (e) => {
        setActiveOnly(e.target.value !== 'all')
    }
    
    useEffect(() => {
        if (activeOnly) {
            axios.get(localAPIRoute+'/barang/vendor')
                .then((res)=>{
                    const formatedVendor = formatDataVendor(res)
                    setVendorData(formatedVendor);

                    setError(false);
                    setIsLoading(false);
                })
                .catch((err)=>{
                    setError(err.message)
                    console.log(err)
                    setIsLoading(false)
                })
        } else {
            axios.get(localAPIRoute+'/barang/vendor', {
                params: {
                    all: 'true'
                }
            })
                .then((res)=>{
                    const formatedVendor = formatDataVendor(res)
                    setVendorData(formatedVendor);

                    setError(false);
                    setIsLoading(false);
                })
                .catch((err)=>{
                    setError(err.message)
                    console.log(err)
                    setIsLoading(false)
                })
        }
    }, [activeOnly])
    
    const VendorTableBody = () => {
        const vendorBody = 
            <tbody>
                { vendorData.map((vendor) => (
                    <tr key={vendor.idvendor}>
                        <td className="px-4 py-2 border-b text-gray-700">{vendor.idvendor}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{vendor.nama_vendor}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{vendor.badan_hukum}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{vendor.status}</td>
                    </tr>
                ))
                }
            </tbody>
        return (
            vendorBody
        )
    }

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Master Data</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-600">Vendor</h2>

            <div className="relative inline-block">
                <select name="Select Active" onChange={handleActive} className="border border-gray-300 rounded-lg px-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white my-3 appearance-none hover:border-blue-300 hover:border-2">
                    <option value="active">Aktif</option>
                    <option value="all">All</option>
                </select>

                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
            </div>
            
            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && !error &&
            
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border-b text-left">ID Vendor</th>
                                <th className="px-4 py-2 border-b text-left">Nama</th>
                                <th className="px-4 py-2 border-b text-left">Badan Hukum</th>
                                <th className="px-4 py-2 border-b text-left">Status</th>
                            </tr>
                        </thead>
                        <VendorTableBody />
                    </table>
                </div>
            }

        </div>
    )
}

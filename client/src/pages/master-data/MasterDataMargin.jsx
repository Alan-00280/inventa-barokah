import axios from "axios";
import { useEffect, useState } from "react";
import localAPIRoute from "../../constant/APIRoute";
import { ChevronDown } from "lucide-react";
import Logger from "../../components/logger";


export default function MasterDataMargin() {
    const [marginData, setMarginData] = useState([]);
    const [marginAktif, setMarginAktif] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [update, setUpdate] = useState(false)

    const handleActive = async (e) => {
        const idMargin = e.target.value
        try {
            setIsLoading(true)
            const postMarginActive = await axios.post(localAPIRoute+'/penjualan/margin-activate', {
                idMargin: idMargin
            })
        } catch (error) {
            setError(error)
        } finally {
            setIsLoading(false)
            setUpdate(prev=>!prev)
        }
    }
        
    useEffect(() => {
        const fetchMargin = async () => {
            try {
                setIsLoading(true)
                const fetchedMargin = await axios.get(localAPIRoute+'/penjualan/margin')
                setMarginData(fetchedMargin.data.margin)
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMargin()
    }, [update])

    useEffect(()=>{
        const aktifMargin = marginData.find(m=>m.status==1)
        setMarginAktif(aktifMargin)
    }, [marginData])

    // [{"idmargin_penjualan":1,"created_at":"2025-10-16T01:47:23.000Z","persen":10,"status":0,"update_at":"2025-11-13T02:27:19.000Z","iduser":100,"username":"superadmin1"},]
    
    const MarginTableBody = () => {
        const marginBody = (marginData.length > 0) ? (

            // <th className="px-4 py-2 border-b text-left">ID Margin</th>
            // <th className="px-4 py-2 border-b text-left">Persentase</th>
            // <th className="px-4 py-2 border-b text-left">Status</th>
            // <th className="px-4 py-2 border-b text-left">Created</th>
            // <th className="px-4 py-2 border-b text-left">Updated</th>
            // <th className="px-4 py-2 border-b text-left">Pembuat</th>
    
            <tbody>
                { marginData.map((margin) => (
                    <tr key={margin.idmargin_penjualan}>
                        <td className="px-4 py-2 border-b text-gray-700">{margin.idmargin_penjualan}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{margin.persen}%</td>
                        <td className="px-4 py-2 border-b text-gray-700">{(margin.status == '1') ? 'Aktif' : 'Nonaktif'}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{margin.created_at}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{margin.update_at}</td>
                        <td className="px-4 py-2 border-b text-gray-700">{margin.username}</td>
                    </tr>
                ))
                }
            </tbody>
        ) : (
            <tbody>
                <tr>
                    <td className="px-4 py-2 border-b text-gray-700 italic">No Available Data</td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                    <td className="px-4 py-2 border-b text-gray-700"> </td>
                </tr>
            </tbody>
        )

        return (
            marginBody
        )
    }

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">Master Data</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-600">Margin</h2>
            
            {/* <Logger Object={marginData} />
            <Logger Object={marginAktif} /> */} 

            {/*style={{width: "calc(1/4 * 100%)"}}*/}
            <div className="flex items-center"> 
                <h2 className=" font-bold text-lg mr-5 text-barokah-700 ">Ubah Margin Aktif: </h2>
                <div className="relative inline-block">
                    <select 
                    name="Select Active" 
                    onChange={handleActive}
                    value={ marginAktif?.idmargin_penjualan || '' } 
                    className="border border-gray-300 rounded-lg px-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white my-3 appearance-none hover:border-blue-300 hover:border-2">
                        
                        {marginAktif &&
                            <option value={marginAktif.idmargin_penjualan}>
                                {marginAktif?.persen}%
                            </option>
                        }

                        {marginData.filter(margin=>margin.status!==1).map(m=>(
                            <option value={m?.idmargin_penjualan}>
                                {m?.persen||'load..'}%
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                </div>
            </div>
            
            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* [{"idmargin_penjualan":1,"created_at":"2025-10-16T01:47:23.000Z","persen":10,"status":0,"update_at":"2025-11-13T02:27:19.000Z","iduser":100,"username":"superadmin1"},] */}

            {!isLoading && !error &&
            
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border-b text-left">ID Margin</th>
                                <th className="px-4 py-2 border-b text-left">Persentase</th>
                                <th className="px-4 py-2 border-b text-left">Status</th>
                                <th className="px-4 py-2 border-b text-left">Created</th>
                                <th className="px-4 py-2 border-b text-left">Updated</th>
                                <th className="px-4 py-2 border-b text-left">Pembuat</th>
                            </tr>
                        </thead>
                        {/* <BarangTableBody /> */}
                        {<MarginTableBody />}
                    </table>
                </div>}
        </div>
    )
}

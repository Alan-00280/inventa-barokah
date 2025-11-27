import axios from "axios"
import { useEffect, useState } from "react"
import localAPIRoute from "../../../constant/APIRoute"
import { useParams } from "react-router"
import Logger from "../../../components/logger"
import PenjualanCard from "./penjualanCard"
import PenjualanDetilCard from "./penjualanDetilCard"



export default function ShowPenjualan() {
    const { id } = useParams()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    
    const [penjualanDetil, setPenjualanDetil] = useState([])
    useEffect(()=>{
        const fetchDetilPenjualan = async () => {
            try {
                setIsLoading(true)
                const fetchedDetilPenjualan = await axios.get(localAPIRoute+'/penjualan/'+id)
                setPenjualanDetil(fetchedDetilPenjualan.data.penjualan)
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDetilPenjualan()
    }, [])

    return (

        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2">Penjualan</h1>

            {isLoading && <p className="text-gray-500 my-5">Loading . . .</p>}
            {error && <p className="text-red-500">{JSON.stringify(error)}</p>}

            {/* <Logger Object={penjualanDetil.penjualan}/> */}
            {!isLoading && penjualanDetil.penjualan && 
                <PenjualanCard data={penjualanDetil.penjualan}/>
            }

            {/* <Logger Object={penjualanDetil.detil_penjualan}/> */}
            <h2 className="text-2xl font-bold mb-2">Detail</h2>
            {!isLoading && penjualanDetil.detil_penjualan && penjualanDetil.detil_penjualan.map(detil=>(
                <PenjualanDetilCard data={detil} key={detil.iddetail_penjualan} /> 
            ))} 
        </div>
    )
}

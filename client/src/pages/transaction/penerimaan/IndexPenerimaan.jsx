import axios from "axios";
import { useEffect, useState } from "react";

import PenerimaanCard from "./penerimaanCard";
import localAPIRoute from "../../../constant/APIRoute";
import Logger from "../../../components/logger";


export default function IndexPenerimaan() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    //? PENERIMAAN FETCHING ?//
    const [penerimaan, setPenerimaan] = useState([]);

    useEffect(()=>{
        const penerimaanFetch = async () => {
            try {
                const fetch = await axios(localAPIRoute+'/penerimaan')
                setPenerimaan(fetch.data.response.penerimaan)
            } catch (err) {
                setError(err)
            } finally {
                setIsLoading(false)
            }
        }
        penerimaanFetch()
    }, [])

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2">Transaksi</h1>
            <h2 className="text-xl font-semibold mb-6 text-gray-600">Penerimaan</h2>

            <h2 id="terima-pengadaan" className="text-2xl font-semibold mb-4 text-barokah-600">Daftar Penerimaan</h2>
            <div className="flex gap-3 mb-6">
                <p><i>*ini harusnya Search Bar</i></p>
            </div>

            {/* <Logger Object={penerimaan} /> */}

            <PenerimaanCard data={penerimaan} />
        </div>
    )
}
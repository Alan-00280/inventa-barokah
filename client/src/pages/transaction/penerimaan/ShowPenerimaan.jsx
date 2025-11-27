import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import localAPIRoute from "../../../constant/APIRoute";
import Logger from "../../../components/logger";
import DetilPenerimaanCards from "./PenerimaanDetailCard";


export default function ShowPenerimaan() {
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [penerimaan, setPenerimaan] = useState([]);
    const [detilPenerimaan, setDetilPenerimaan] = useState([]);

    useEffect(() => {
        //? Fetch Penerimaan + Detil ?//
        const fetchPenerimaan = async () => {
            try {
                const fetchedPenerimaan = await axios.get(localAPIRoute + '/penerimaan', {
                    params: { id: id }
                })
                setPenerimaan(fetchedPenerimaan.data.response.penerimaan[0]) //? Penerimaan
                setDetilPenerimaan(fetchedPenerimaan.data.response.detilPenerimaan) //? Detilnya
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPenerimaan()
    }, [id])

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-2">Penerimaan</h1>
            {/* <Logger Object={penerimaan} />
            <Logger Object={detilPenerimaan} /> */}
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Penerimaan: {id}
                </h2>


                <div className="grid grid-cols-4 gap-y-2 text-sm text-gray-700">
                    <span className="font-medium">ID Penerimaan</span>
                    <span className="col-span-3">{penerimaan.idpenerimaan}</span>

                    <span className="font-medium">Waktu</span>
                    <span className="col-span-3">
                        {new Date(penerimaan.created_at).toLocaleString('id-ID', {
                            dateStyle: 'full',
                            timeStyle: 'short'
                        })}
                    </span>

                    <span className="font-medium">Status</span>
                    <span className="col-span-3">
                        <span
                            className={
                                "text-xs font-medium px-3 py-1 rounded-full " +
                                (penerimaan.status === "N"
                                    ? "bg-green-100 text-green-700 "
                                    : "bg-red-100 text-red-700")
                            }
                        >
                            {penerimaan.status === "N" ? "Selesai" : "Diproses"}
                        </span>
                    </span>


                    <span className="font-medium">ID Pengadaan</span>
                    <span className="col-span-3">{penerimaan.idpengadaan}</span>

                    <span className="font-medium">User</span>
                    <span className="col-span-3">
                        {penerimaan.username} (ID: {penerimaan.iduser})
                    </span>
                </div>

            </div>

            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}

            <DetilPenerimaanCards data={detilPenerimaan} />
        </div>
    )
}

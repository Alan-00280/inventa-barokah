import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import localAPIRoute from "../../../constant/APIRoute";
import TerimaPengadaanCard from "./penerimaanPengadaanCard";
import Logger from "../../../components/logger";

export default function PenerimaanPengadaan() {
    //? Mengambil Params dari url '/:id' ?//
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pengadaan, setPengadaan] = useState([]);
    const [detailPengadaan, setDetailPengadaan] = useState([]);
    const [penerimaanThis, setPenerimaanThis] = useState([]);

    useEffect(()=>{
        const fetchPengadaan = async () => {
            try {
                const pengadaan = await axios.get(localAPIRoute+'/pengadaan', {
                    params:{ id: id, detil: 'true' }
                })
                setPengadaan(pengadaan.data.pengadaan)
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false);
            }
        }
        const fetchDetailPengadaan = async () => {
            try {
                const detailPengadaan = await axios.post(localAPIRoute+'/pengadaan', {
                    id: id,
                    barang: "true"
                })
                setDetailPengadaan(detailPengadaan.data.detailPengadaan[0])
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false);
            }
        }
        const fetchThisPenerimaan = async () => {
            try {
                const penerimaanThis = await axios.get(localAPIRoute+`/penerimaan/detil-by-pengadaan?idPengadaan=${id}`)
                setPenerimaanThis(penerimaanThis.data.results[0])
            } catch (error) {
                setError(error)
            } finally {
                setIsLoading(false);
            }
        }

        fetchPengadaan()
        fetchDetailPengadaan()
        fetchThisPenerimaan()
    }, [])

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6 my-4">
            <h1 className="text-2xl font-bold mb-2">Terima Pengadaan</h1>
            <div className="flex-1 bg-white p-4 rounded-lg shadow-md border border-gray-200 w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Pengadaan: {id}
                </h2>

                <div className="grid grid-cols-4 gap-y-2 text-sm text-gray-700">
                    <span className="font-medium">Waktu</span>
                    <span className="col-span-3">{new Date(pengadaan.timestamp).toLocaleString()}</span>

                    <span className="font-medium">User</span>
                    <span className="col-span-3">{pengadaan.username} - {pengadaan.iduser}</span>

                    <span className="font-medium">Vendor</span>
                    <span className="col-span-3">{pengadaan.nama_vendor}</span>

                </div>
            </div>

            {/* <Logger Object={pengadaan} /> */}

            {isLoading && <p className="text-gray-500">Loading . . .</p>}
            {error && <p className="text-red-500">{error}</p>}
        
            <TerimaPengadaanCard data={detailPengadaan} dataPenerimaan={penerimaanThis} ppn={pengadaan.ppn} vendorID={pengadaan.idvendor} pengadaanID={pengadaan.idpengadaan} status={pengadaan.status}/>
            
        </div>
    )
}
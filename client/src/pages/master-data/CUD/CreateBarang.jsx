import {
    Dialog,
    Button,
    Input,
    Checkbox,
    Typography,
    IconButton,
    Select,
} from "@material-tailwind/react";
import axios from "axios";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import localAPIRoute from "../../../constant/APIRoute";
import Logger from "../../../components/logger";
import { data, useNavigate } from "react-router";

export default function DialogCreateBarang({f={setLoading: ()=>{}, setErr: ()=>{}}}) {

    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);

    //? data satuan (untuk option) ?//
    const [satuan, setSatuan] = useState([])
    useEffect(()=>{
        const fetchSatuan = async () => {
            try {
                f.setLoading(true)
                const fetchedSatuan = await axios.get(localAPIRoute+'/barang/satuan');
                setSatuan(fetchedSatuan.data.satuan)
            } catch (error) {
                f.setErr(error)
            } finally {
                f.setLoading(false)
            }
        }
        fetchSatuan()
    }, [])

    //? preparing data nya ?//
    const [barangData, setBarangData] = useState({
        nama: '',
        jenis_char: '',
        harga: null,
        idsatuan: ''
    });
    const handleChange = (e) => {
        setBarangData(prev=>({...prev, [e.target.name]: e.target.value}))
    }
    const resetBarang = () => {
        setBarangData({
            nama: '',
            jenis_char: '',
            harga: null,
            idsatuan: ''
        })
    }

    //? Handel submit ?//
    const handleSubmit = async () => {
        try {
            const postBarang = await axios.post(localAPIRoute+'/barang', {
                data_barang: barangData
            })
            alert('Berhasil menambahkan barang')
            navigate('/master-data/barang')
        } catch (error) {
            f.setErr(error)
            alert(JSON.stringify(error))
        }
    }


    return (
        <Dialog size="sm" open={isOpen} onOpenChange={(isopen) => {if (!isopen) {resetBarang(); setIsOpen(false)}} }>
            <Dialog.Trigger as={Button} onClick={() => setIsOpen(true)} className='my-3'><Plus className="w-5 h-5" /> Tambah Barang</Dialog.Trigger>
            <Dialog.Overlay >
                <Dialog.Content>
                    <Dialog.DismissTrigger
                        as={IconButton}
                        size="sm"
                        variant="ghost"
                        color="secondary"
                        className="absolute right-2 top-2"
                        isCircular
                    >
                    <X className="h-5 w-5" onClick={() => setIsOpen(false)} />
                    </Dialog.DismissTrigger>
                    <Typography type="h6" className="mb-1">
                        Tambah Barang
                    </Typography>
                    <Typography className="text-foreground">
                        Masukkan Nama, Jenis, Harga per satuan, Satuan
                    </Typography>
                    {/* <Logger Object={barangData} /> */}
                    {/* <Logger Object={satuan} /> */}
                    <form className="mt-6" onSubmit={handleSubmit}>
                        <div className="mb-4 mt-2 space-y-1.5">
                            <Typography
                                as="label"
                                htmlFor="nama"
                                type="small"
                                color="default"
                                className="font-semibold"
                                onChange={(e) => handleChange(e)}
                            >
                                Nama Barang
                            </Typography>
                            <Input
                                id="nama"
                                type="text"
                                placeholder="Masukan Nama Barang . . . "
                                name="nama"
                                onChange={(e) => handleChange(e)}
                                minLength={3}
                                required
                            />
                        </div>
                        <div className="mb-4 mt-2 space-y-1.5">
                            <Typography
                                as="label"
                                htmlFor="Jenis Barang"
                                type="small"
                                color="default"
                                className="font-semibold"
                            >
                                Jenis Barang
                            </Typography>
                            <Select
                                value={barangData.jenis_char}
                                onValueChange={(v) => (handleChange({target: {name: 'jenis_char', value: v}}))}
                            >
                                <Select.Trigger className="w-72" placeholder="Pilih Jenis Barang" />
                                <Select.List>
                                    <Select.Option key='D' value='D'>Dagang</Select.Option>
                                    <Select.Option key='A' value='A'>Aset</Select.Option>
                                    <Select.Option key='B' value='B'>Barang</Select.Option>
                                </Select.List>
                            </Select>
                        </div>
                        <div className="mb-4 mt-2 space-y-1.5">
                            <Typography
                                as="label"
                                htmlFor="satuan"
                                type="small"
                                color="default"
                                className="font-semibold"
                            >
                                Satuan
                            </Typography>
                            <Select
                                value={barangData.idsatuan}
                                onValueChange={(v) => (handleChange({target: {name: 'idsatuan', value: v}}))}
                            >
                                <Select.Trigger className="w-72" placeholder="Pilih Satuan" />
                                <Select.List>
                                    {satuan && satuan.map(i=>(
                                        <Select.Option key={i.idsatuan} value={i.idsatuan}>{i.nama_satuan}</Select.Option>
                                    ))}
                                </Select.List>
                            </Select>
                        </div>
                        <div className="mb-4 space-y-1.5">
                            <Typography
                                as="label"
                                htmlFor="harga"
                                type="small"
                                color="default"
                                className="font-semibold"
                            >
                                Harga (per satuan)
                            </Typography>
                            <div className="flex gap-1 items-center">
                                Rp.
                                <Input 
                                    id="harga" 
                                    type="number" 
                                    placeholder="0" 
                                    name="harga"
                                    onChange={(e) => handleChange(e)}
                                    min='500'
                                    required 
                                />
                            </div>
                            
                        </div>
                        <Button isFullWidth >Buat</Button>
                    </form>
                </Dialog.Content>
            </Dialog.Overlay>
        </Dialog>
    );
}
